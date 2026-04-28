export type Role = "doctor" | "nurse" | "pharmacist" | "admin";
export type AccountStatus = "active" | "deactivated";

export interface User {
  id: string;
  username: string;
  role: Role;
  status: AccountStatus;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactInfo: string;
  createdAt: string;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  diagnosis: string;
  notes: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: "pending" | "dispensed" | "cancelled";
  prescribedBy: string;
  createdAt: string;
}

export interface Vital {
  id: string;
  patientId: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  spO2: number;
  recordedBy: string;
  recordedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  details: string;
}
