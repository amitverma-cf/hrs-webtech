"use client";

import { useState, useEffect, useCallback } from "react";
import { Patient } from "@/lib/schemas";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch patients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPatient = async (data: Partial<Patient>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchPatients();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create patient";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const admitPatient = async (patientId: string, templateId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clinical/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, templateId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      return await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to admit patient";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchPatients());
  }, [fetchPatients]);

  return { patients, isLoading, error, createPatient, admitPatient, refresh: fetchPatients };
}
