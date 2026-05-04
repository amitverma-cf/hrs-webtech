import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { UserSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { AuditService } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UserSchema.parse(body);

    const db = await getDatabase();
    const existingUser = await db.collection("users").findOne({ username: validated.username });

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);
    const userId = uuidv4();

    const newUser = {
      id: userId,
      username: validated.username,
      passwordHash,
      role: validated.role,
      accountStatus: "active",
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    await AuditService.log("SIGNUP", "user", userId, userId, { role: validated.role });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 400 });
  }
}
