import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  try {
    const h = await headers();
    const role = h.get("x-user-role");
    const userId = h.get("x-user-id");

    if (role !== "patient") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDatabase();
    
    // Find the latest admission for this user
    const admission = await db.collection("admissions").aggregate([
      { $match: { patientId: userId } },
      { $sort: { startDate: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "beds",
          localField: "bedId",
          foreignField: "id",
          as: "bed"
        }
      },
      { $unwind: "$bed" },
      {
        $lookup: {
          from: "templates",
          localField: "templateId",
          foreignField: "id",
          as: "template"
        }
      },
      { $unwind: "$template" }
    ]).next();

    if (!admission) {
      return NextResponse.json({ error: "No admission record found" }, { status: 404 });
    }

    // Get tasks for this admission
    const tasks = await db.collection("tasks").find({ admissionId: admission.id }).sort({ targetTime: 1 }).toArray();

    // Get billing for this admission
    const billing = await db.collection("billing").findOne({ admissionId: admission.id });

    return NextResponse.json({
      admission,
      tasks,
      billing: billing || { lineItems: [], total: 0 }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
