import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { VitalLogSchema } from "@/lib/schemas";
import { AuditService } from "@/lib/audit";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");
    const userId = h.get("x-user-id");

    if (role !== "nurse" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = VitalLogSchema.parse(body);
    const db = await getDatabase();
    const id = uuidv4();

    await db.collection("vital_logs").insertOne({
      id,
      ...data,
      nurseId: userId,
      recordedAt: new Date(),
    });

    await AuditService.log("VITALS_LOGGED", "vital_log", id, userId!);

    return NextResponse.json({ id, message: "Vitals logged successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
