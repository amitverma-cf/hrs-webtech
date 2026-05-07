import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "admin" && role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDatabase();
    const templates = await db.collection("templates").find().toArray();
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const h = await headers();
    const role = h.get("x-user-role");

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const db = await getDatabase();
    
    const newTemplate = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    };

    await db.collection("templates").insertOne(newTemplate);
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
