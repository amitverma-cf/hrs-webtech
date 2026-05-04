import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { PrescriptionSchema } from "@/lib/schemas";
import { AuditService } from "@/lib/audit";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");
    const userId = h.get("x-user-id");

    if (role !== "doctor" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = PrescriptionSchema.parse(body);
    const db = await getDatabase();
    const id = uuidv4();

    await db.collection("prescriptions").insertOne({
      id,
      ...data,
      doctorId: userId,
      status: "pending",
      createdAt: new Date(),
    });

    await AuditService.log("PRESCRIPTION_ISSUED", "prescription", id, userId!);

    return NextResponse.json({ id, message: "Prescription issued" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
