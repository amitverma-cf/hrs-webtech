import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const updateData = await req.json();

    const db = await getDatabase();
    await db.collection("templates").updateOne(
      { id },
      { $set: updateData }
    );

    return NextResponse.json({ message: "Template updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const db = await getDatabase();
    
    // Check if any active admissions are using this template
    const activeAdmission = await db.collection("admissions").findOne({ templateId: id, status: "active" });
    if (activeAdmission) {
      return NextResponse.json({ error: "Cannot delete a template currently in use by an active admission" }, { status: 400 });
    }

    await db.collection("templates").deleteOne({ id });
    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
