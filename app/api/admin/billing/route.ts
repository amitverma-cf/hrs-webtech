import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function GET() {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDatabase();
    
    // Aggregating global billing data
    const billingRecords = await db.collection("billing").aggregate([
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
          from: "patients",
          localField: "admission.patientId",
          foreignField: "id",
          as: "patient"
        }
      },
      { $unwind: "$patient" }
    ]).toArray();

    return NextResponse.json(billingRecords);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error" }, { status: 400 });
  }
}
