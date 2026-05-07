"use client";

import { useState, useCallback } from "react";
import { VitalLog } from "@/lib/schemas";

export function useVitals(patientId?: string) {
  const [vitals, setVitals] = useState<VitalLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVitals = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/clinical/vitals/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVitals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vitals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logVitals = async (data: VitalLog) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clinical/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      if (patientId) await fetchVitals(patientId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to log vitals";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { vitals, isLoading, error, logVitals, fetchVitals };
}
