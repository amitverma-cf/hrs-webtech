import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { TaskService } from "@/lib/tasks";

export async function GET() {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (!["admin", "doctor", "nurse"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDatabase();
    const admissions = await db.collection("admissions").find().toArray();
    
    // Join with beds and templates for detailed view
    const bedIds = [...new Set(admissions.map(a => a.bedId))];
    const templateIds = [...new Set(admissions.map(a => a.templateId))];
    
    const [beds, templates] = await Promise.all([
      db.collection("beds").find({ id: { $in: bedIds } }).toArray(),
      db.collection("templates").find({ id: { $in: templateIds } }).toArray()
    ]);
    
    const admissionsWithDetails = admissions.map(ad => ({
      ...ad,
      bed: beds.find(b => b.id === ad.bedId),
      template: templates.find(t => t.id === ad.templateId)
    }));

    return NextResponse.json(admissionsWithDetails);
  } catch (error) {
    console.error("Admission error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const h = await headers();
    const doctorRole = h.get("x-user-role");
    const doctorId = h.get("x-user-id");

    if (doctorRole !== "doctor" && doctorRole !== "admin") {
      return NextResponse.json({ error: "Only doctors can admit patients" }, { status: 403 });
    }

    const { patientId, templateId } = await req.json();
    const db = await getDatabase();

    // 1. Auto-allocate an available bed
    const bed = await db.collection("beds").findOne({ isOccupied: false });
    if (!bed) {
      return NextResponse.json({ error: "No available beds in the facility" }, { status: 400 });
    }

    // 2. Check if patient is already admitted
    const activeAdmission = await db.collection("admissions").findOne({ 
      patientId, 
      status: "active" 
    });
    if (activeAdmission) {
      return NextResponse.json({ error: "Patient is already admitted" }, { status: 400 });
    }

    const admissionId = uuidv4();
    const newAdmission = {
      id: admissionId,
      patientId,
      doctorId,
      bedId: bed.id,
      templateId,
      status: "active",
      startDate: new Date(),
    };

    // 3. Perform atomic-like updates (using simple writes for now as per mongo-memory-server compatibility)
    await db.collection("admissions").insertOne(newAdmission);
    
    await db.collection("beds").updateOne(
      { id: bed.id },
      { $set: { isOccupied: true, currentPatientId: patientId } }
    );

    // 4. Trigger Task Generation
    const taskCount = await TaskService.generateTasksForAdmission(admissionId, templateId);

    return NextResponse.json({ 
      message: "Patient admitted successfully", 
      admissionId, 
      roomNumber: bed.roomNumber,
      tasksGenerated: taskCount
    }, { status: 201 });

  } catch (error) {
    console.error("Admission error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
