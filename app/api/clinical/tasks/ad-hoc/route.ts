import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "doctor" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { patientId, type, description, targetTime, priority } = await req.json();
    const db = await getDatabase();

    // Find active admission for this patient
    const admission = await db.collection("admissions").findOne({ 
      patientId, 
      status: "active" 
    });

    if (!admission) {
      return NextResponse.json({ error: "No active admission found for this patient" }, { status: 400 });
    }

    const newTask = {
      id: uuidv4(),
      admissionId: admission.id,
      type,
      description,
      targetTime: new Date(targetTime),
      status: "pending",
      priority: priority || "normal",
      isAdHoc: true,
      createdAt: new Date(),
    };

    await db.collection("tasks").insertOne(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
