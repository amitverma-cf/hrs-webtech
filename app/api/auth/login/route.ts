import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { LoginSchema } from "@/lib/schemas";
import { signJWT } from "@/lib/auth";
import { AuditService } from "@/lib/audit";
import { cookies } from "next/headers";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = LoginSchema.parse(body);
    
    const db = await getDatabase();
    const user = await db.collection("users").findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.accountStatus === "deactivated") {
      return NextResponse.json({ error: "Account deactivated" }, { status: 403 });
    }

    const token = await signJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    await AuditService.log("LOGIN", "user", user.id, user.id);

    return NextResponse.json({ role: user.role });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
