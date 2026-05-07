import { z } from "zod";

export const RoleEnum = z.enum(["doctor", "nurse", "pharmacist", "admin", "patient"]);
export const AccountStatusEnum = z.enum(["active", "inactive", "deactivated"]);

export const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3).max(50),
  password: z.string().min(8).optional(), // optional for updates
  role: RoleEnum,
  accountStatus: AccountStatusEnum.default("inactive"),
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  department: z.string().optional(),
  specialty: z.string().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.date().optional(),
});

export const SignupSchema = UserSchema.extend({
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const WardSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g., "ICU", "Ward A"
  description: z.string().optional(),
});

export const BedSchema = z.object({
  id: z.string(),
  wardId: z.string(), // Link to Ward
  roomNumber: z.string(),
  isOccupied: z.boolean().default(false),
  currentPatientId: z.string().optional(),
  dailyRate: z.number(),
});

export const DiseaseTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  metrics: z.array(z.object({
    name: z.string(),
    frequencyHours: z.number(),
  })),
  medications: z.array(z.object({
    name: z.string(),
    dose: z.string(),
    frequencyHours: z.number(),
    cost: z.number(),
  })),
  vitalThresholds: z.array(z.object({
    metric: z.string(), // e.g., "spO2"
    min: z.number().optional(),
    max: z.number().optional(),
    urgent: z.boolean().default(true),
  })).optional(),
});

export const AdmissionSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
  bedId: z.string(),
  templateId: z.string(),
  status: z.enum(["active", "discharged"]),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const TaskSchema = z.object({
  id: z.string(),
  admissionId: z.string(),
  type: z.enum(["metric", "medication", "alert"]), // "alert" for threshold breached
  description: z.string(), // e.g., "Blood Sugar" or "Paracetamol 500mg"
  targetTime: z.date(),
  status: z.enum(["pending", "completed", "missed", "cancelled"]),
  priority: z.enum(["normal", "high", "urgent"]).default("normal"),
  executedBy: z.string().optional(),
  result: z.unknown().optional(), // for metrics: { value: 98 }
  cost: z.number().optional(),
  isAdHoc: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const BillingSchema = z.object({
  id: z.string().optional(),
  admissionId: z.string(),
  lineItems: z.array(z.object({
    description: z.string(),
    amount: z.number(),
    date: z.date(),
  })),
  total: z.number(),
  status: z.enum(["pending", "paid"]).default("pending"),
});

// Legacy/UI Schemas (updated)
export const PatientSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1),
  dateOfBirth: z.string(),
  gender: z.string(),
  contactInfo: z.string(),
  allergies: z.array(z.string()).default([]),
});

export const VitalLogSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  temperature: z.number(),
  bloodPressure: z.string(),
  heartRate: z.number().int(),
  spO2: z.number().int().min(0).max(100),
  recordedAt: z.date().optional(),
});

export const PrescriptionSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  doctorId: z.string().optional(),
  medicationName: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
  status: z.enum(["pending", "dispensed", "rejected"]).default("pending"),
  createdAt: z.date().optional(),
});

export const AuditLogSchema = z.object({
  id: z.string(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  performedBy: z.string(),
  details: z.unknown().optional(),
  timestamp: z.date(),
});

// Inferred Types
export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleEnum>;
export type AccountStatus = z.infer<typeof AccountStatusEnum>;
export type Ward = z.infer<typeof WardSchema>;
export type Bed = z.infer<typeof BedSchema>;
export type DiseaseTemplate = z.infer<typeof DiseaseTemplateSchema>;
export type Admission = z.infer<typeof AdmissionSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Billing = z.infer<typeof BillingSchema>;
export type Prescription = z.infer<typeof PrescriptionSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type VitalLog = z.infer<typeof VitalLogSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;

export type AdmissionWithDetails = Admission & {
  bed?: Bed;
  template?: DiseaseTemplate;
  doctor?: User;
  patient?: Patient;
};

export type Intervention = Task & {
  roomNumber: string;
  patientName?: string;
  patientId: string;
};
