import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";
import { SecurityService } from "@/lib/security";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (!["nurse", "doctor", "admin"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDatabase();

    const patient = await db.collection("patients").findOne({ id });
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const lastVitals = await db.collection("vitals")
      .find({ patientId: id })
      .sort({ recordedAt: -1 })
      .limit(1)
      .toArray();

    return NextResponse.json({
      fullName: SecurityService.decrypt(patient.fullName),
      allergies: patient.allergies || [],
      lastVitals: lastVitals[0] || null
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
