import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { PatientSchema } from "@/lib/schemas";
import { SecurityService } from "@/lib/security";
import { AuditService } from "@/lib/audit";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = PatientSchema.parse(body);
    const db = await getDatabase();
    const id = uuidv4();
    
    const h = await headers();
    const userId = h.get("x-user-id") || "system";

    const encryptedData = {
      id,
      fullName: SecurityService.encrypt(data.fullName),
      dateOfBirth: SecurityService.encrypt(data.dateOfBirth),
      gender: data.gender,
      contactInfo: SecurityService.encrypt(data.contactInfo),
      createdAt: new Date(),
    };

    await db.collection("patients").insertOne(encryptedData);
    await AuditService.log("PATIENT_CREATED", "patient", id, userId);

    return NextResponse.json({ id, message: "Patient created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const patients = await db.collection("patients").find().toArray();
    
    const decryptedList = patients.map(p => ({
      ...p,
      fullName: SecurityService.decrypt(p.fullName),
    }));

    return NextResponse.json(decryptedList);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
