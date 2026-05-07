import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "doctor" && role !== "nurse" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { patientId } = await params;
    const db = await getDatabase();
    const logs = await db.collection("vital_logs")
      .find({ patientId })
      .sort({ recordedAt: -1 })
      .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
