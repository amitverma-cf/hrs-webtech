import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { connectDB } from "../db";
import { v4 as uuidv4 } from "uuid";
import { VitalLogSchema } from "../schemas";
import { AuditService } from "../services/audit.service";

export class VitalController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const data = VitalLogSchema.parse(req.body);
      const db = await connectDB();
      const id = uuidv4();

      await db.collection("vital_logs").insertOne({
        id,
        ...data,
        nurseId: req.user!.id,
        recordedAt: new Date(),
      });

      await AuditService.log("VITALS_LOGGED", "vital_log", id, req.user!.id);

      res.status(201).json({ id, message: "Vitals logged successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getByPatientId(req: AuthRequest, res: Response) {
    try {
      const { patientId } = req.params;
      const db = await connectDB();
      const logs = await db.collection("vital_logs")
        .find({ patientId })
        .sort({ recordedAt: -1 })
        .toArray();
      res.json(logs);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
