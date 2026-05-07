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
    const beds = await db.collection("beds").find().sort({ roomNumber: 1 }).toArray();
    return NextResponse.json(beds);
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

    const { roomNumber, dailyRate } = await req.json();
    const db = await getDatabase();
    
    const newBed = {
      id: uuidv4(),
      roomNumber,
      dailyRate: Number(dailyRate),
      isOccupied: false,
      createdAt: new Date(),
    };

    await db.collection("beds").insertOne(newBed);
    return NextResponse.json(newBed, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
