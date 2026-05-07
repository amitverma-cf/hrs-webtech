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
    
    // Convert numerical values if present
    if (updateData.dailyRate) updateData.dailyRate = Number(updateData.dailyRate);

    const db = await getDatabase();
    await db.collection("beds").updateOne(
      { id },
      { $set: updateData }
    );

    return NextResponse.json({ message: "Bed updated successfully" });
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
    
    // Check if occupied
    const bed = await db.collection("beds").findOne({ id });
    if (bed?.isOccupied) {
      return NextResponse.json({ error: "Cannot delete an occupied bed" }, { status: 400 });
    }

    await db.collection("beds").deleteOne({ id });
    return NextResponse.json({ message: "Bed deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
