"use client";

import { useState, useEffect, useCallback } from "react";
import { AdmissionWithDetails, Task, Billing } from "@/lib/schemas";

export function usePatientAdmission() {
  const [data, setData] = useState<{
    admission: AdmissionWithDetails;
    tasks: Task[];
    billing: Billing;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmissionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/patients/me/admission");
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchAdmissionData());
  }, [fetchAdmissionData]);

  return { data, isLoading, error, refresh: fetchAdmissionData };
}
