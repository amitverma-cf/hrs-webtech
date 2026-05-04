import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const h = await headers();
    const userId = h.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const user = await db.collection("users").findOne({ id: userId }, { projection: { passwordHash: 0 } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
