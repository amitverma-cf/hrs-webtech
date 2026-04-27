import { z } from "zod";

export const RoleEnum = z.enum(["doctor", "nurse", "pharmacist", "admin"]);
export const AccountStatusEnum = z.enum(["active", "deactivated"]);

export const UserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: RoleEnum,
});

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const PatientSchema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string(), // ISO date
  gender: z.string(),
  contactInfo: z.string(),
});

export const ClinicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  diagnosis: z.string().min(1),
  notes: z.string().min(1),
});

export const PrescriptionSchema = z.object({
  patientId: z.string().uuid(),
  medicationName: z.string().min(1),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
});

export const VitalLogSchema = z.object({
  patientId: z.string().uuid(),
  temperature: z.number(),
  bloodPressure: z.string(),
  heartRate: z.number().int(),
  spO2: z.number().int().min(0).max(100),
});
