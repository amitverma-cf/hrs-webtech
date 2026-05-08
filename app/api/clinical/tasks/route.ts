import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const wardId = searchParams.get("wardId");

    const h = await headers();
    const role = h.get("x-user-role");

    if (!["admin", "nurse", "pharmacist", "doctor"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDatabase();

    // Join with admissions and beds to get room numbers
    const tasks = await db.collection("tasks").aggregate([
      { $match: { status } },
      {
        $lookup: {
          from: "admissions",
          localField: "admissionId",
          foreignField: "id",
          as: "admission"
        }
      },
      { $unwind: "$admission" },
      {
        $lookup: {
          from: "beds",
          localField: "admission.bedId",
          foreignField: "id",
          as: "bed"
        }
      },
      { $unwind: "$bed" },
      ...(wardId ? [{ $match: { "bed.wardId": wardId } }] : []),
      {
        $project: {
          id: 1,
          type: 1,
          description: 1,
          targetTime: 1,
          status: 1,
          priority: 1,
          roomNumber: "$bed.roomNumber",
          wardId: "$bed.wardId",
          patientId: "$admission.patientId"
        }
      },
      { $sort: { priority: -1, targetTime: 1 } } // Urgent tasks first
    ]).toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
