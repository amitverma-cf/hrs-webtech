import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { TaskService } from "@/lib/tasks";
import { headers } from "next/headers";

export async function POST(
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
    const db = await getDatabase();

    const admission = await db.collection("admissions").findOne({ id });
    if (!admission) return NextResponse.json({ error: "Admission not found" }, { status: 404 });

    const taskCount = await TaskService.generateTasksForAdmission(admission.id, admission.templateId);

    return NextResponse.json({ message: "Protocol extended", tasksGenerated: taskCount });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
