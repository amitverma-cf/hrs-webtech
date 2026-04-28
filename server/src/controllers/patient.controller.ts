import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { connectDB } from "../db";
import { v4 as uuidv4 } from "uuid";
import { PatientSchema } from "../schemas";
import { SecurityService } from "../services/security.service";
import { AuditService } from "../services/audit.service";

export class PatientController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const data = PatientSchema.parse(req.body);
      const db = await connectDB();
      const id = uuidv4();

      // Encrypt sensitive fields
      const encryptedData = {
        id,
        fullName: SecurityService.encrypt(data.fullName),
        dateOfBirth: SecurityService.encrypt(data.dateOfBirth),
        gender: data.gender,
        contactInfo: SecurityService.encrypt(data.contactInfo),
        createdAt: new Date(),
      };

      await db.collection("patients").insertOne(encryptedData);
      await AuditService.log("PATIENT_CREATED", "patient", id, req.user!.id);

      res.status(201).json({ id, message: "Patient created successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const db = await connectDB();
      const patient = await db.collection("patients").findOne({ id });

      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      // Decrypt PII
      const decryptedPatient = {
        ...patient,
        fullName: SecurityService.decrypt(patient.fullName),
        dateOfBirth: SecurityService.decrypt(patient.dateOfBirth),
        contactInfo: SecurityService.decrypt(patient.contactInfo),
      };

      res.json(decryptedPatient);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async list(req: AuthRequest, res: Response) {
    try {
      const db = await connectDB();
      const patients = await db.collection("patients").find().toArray();
      
      // Decrypt basic info for list
      const decryptedList = patients.map(p => ({
        ...p,
        fullName: SecurityService.decrypt(p.fullName),
      }));

      res.json(decryptedList);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
