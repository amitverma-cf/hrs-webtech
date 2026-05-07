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
    const users = await db.collection("users")
      .find({}, { projection: { passwordHash: 0 } })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
