import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../db";
import { PatientSchema } from "../schemas";
import { SecurityService } from "../services/security.service";
import { AuditService } from "../services/audit.service";

export class PatientController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const data = PatientSchema.parse(req.body);

      // Encrypt sensitive fields
      const patient = await prisma.patient.create({
        data: {
          fullName: SecurityService.encrypt(data.fullName),
          dateOfBirth: SecurityService.encrypt(data.dateOfBirth),
          gender: data.gender,
          contactInfo: SecurityService.encrypt(data.contactInfo),
        },
      });

      await AuditService.log("PATIENT_CREATED", "patient", patient.id, req.user!.id);

      res.status(201).json({ id: patient.id, message: "Patient created successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const patient = await prisma.patient.findUnique({
        where: { id },
      });

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
      const patients = await prisma.patient.findMany();
      
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
