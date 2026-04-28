import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { connectDB } from "../db";

export class AdminController {
  static async getAuditLogs(req: AuthRequest, res: Response) {
    try {
      const db = await connectDB();
      const logs = await db.collection("audit_logs")
        .find()
        .sort({ timestamp: -1 })
        .toArray();
      res.json(logs);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUsers(req: AuthRequest, res: Response) {
    try {
      const db = await connectDB();
      const users = await db.collection("users")
        .find({}, { projection: { passwordHash: 0 } })
        .toArray();
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateUserStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await connectDB();

      if (!["active", "deactivated"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      await db.collection("users").updateOne(
        { id },
        { $set: { accountStatus: status } }
      );

      res.json({ message: `User status updated to ${status}` });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
