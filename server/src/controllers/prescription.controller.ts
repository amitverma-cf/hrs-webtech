import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { connectDB } from "../db";
import { v4 as uuidv4 } from "uuid";
import { PrescriptionSchema } from "../schemas";
import { AuditService } from "../services/audit.service";

export class PrescriptionController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const data = PrescriptionSchema.parse(req.body);
      const db = await connectDB();
      const id = uuidv4();

      await db.collection("prescriptions").insertOne({
        id,
        ...data,
        doctorId: req.user!.id,
        status: "pending",
        createdAt: new Date(),
      });

      await AuditService.log("PRESCRIPTION_ISSUED", "prescription", id, req.user!.id);

      res.status(201).json({ id, message: "Prescription issued" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async listPending(req: AuthRequest, res: Response) {
    try {
      const db = await connectDB();
      // In a real app we'd use aggregate to join with patient info
      const pending = await db.collection("prescriptions")
        .find({ status: "pending" })
        .toArray();
      res.json(pending);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await connectDB();

      if (!["dispensed", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      await db.collection("prescriptions").updateOne(
        { id },
        { $set: { status } }
      );

      await AuditService.log("PRESCRIPTION_STATUS_UPDATED", "prescription", id, req.user!.id, { status });

      res.json({ message: `Prescription marked as ${status}` });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
