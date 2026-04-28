import type { Request, Response } from "express";
import { connectDB } from "../db";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { LoginSchema, UserSchema } from "../schemas";
import { AuditService } from "../services/audit.service";

const JWT_SECRET = (process.env.JWT_SECRET || "default-jwt-secret") as string;

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = LoginSchema.parse(req.body);
      const db = await connectDB();
      
      const user = await db.collection("users").findOne({ username });

      if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (user.accountStatus === "deactivated") {
        return res.status(403).json({ error: "Account deactivated" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      await AuditService.log("LOGIN", "user", user.id, user.id);

      res.json({ token, role: user.role });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = UserSchema.parse(req.body);
      const db = await connectDB();
      
      const passwordHash = await Bun.password.hash(password);
      const id = uuidv4();

      await db.collection("users").insertOne({
        id,
        username,
        passwordHash,
        role,
        accountStatus: "active",
        createdAt: new Date(),
      });

      await AuditService.log("USER_CREATED", "user", id, "system");

      res.status(201).json({ message: "User registered successfully", id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
