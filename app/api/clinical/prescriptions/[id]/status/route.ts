import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { AuditService } from "@/lib/audit";
import { headers } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");
    const userId = h.get("x-user-id");

    if (role !== "pharmacist" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!["dispensed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection("prescriptions").updateOne(
      { id },
      { $set: { status } }
    );

    await AuditService.log("PRESCRIPTION_STATUS_UPDATED", "prescription", id, userId!, { status });

    return NextResponse.json({ message: `Prescription marked as ${status}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
