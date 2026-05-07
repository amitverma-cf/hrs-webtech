import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "doctor" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (status !== "discharged") {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    const db = await getDatabase();
    
    // 1. Find the admission to get bedId and patientId
    const admission = await db.collection("admissions").findOne({ id });
    if (!admission) {
      return NextResponse.json({ error: "Admission not found" }, { status: 404 });
    }

    // 2. Update admission status
    await db.collection("admissions").updateOne(
      { id },
      { $set: { status: "discharged", endDate: new Date() } }
    );

    // 3. Free the bed
    await db.collection("beds").updateOne(
      { id: admission.bedId },
      { $set: { isOccupied: false, currentPatientId: null } }
    );

    // 4. Mark all remaining pending tasks as 'cancelled' or 'missed'
    await db.collection("tasks").updateMany(
      { admissionId: id, status: "pending" },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json({ message: "Patient discharged successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
