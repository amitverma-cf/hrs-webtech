import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { SecurityService } from "@/lib/security";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const patient = await db.collection("patients").findOne({ id });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const decryptedPatient = {
      ...patient,
      fullName: SecurityService.decrypt(patient.fullName),
      dateOfBirth: SecurityService.decrypt(patient.dateOfBirth),
      contactInfo: SecurityService.decrypt(patient.contactInfo),
    };

    return NextResponse.json(decryptedPatient);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
