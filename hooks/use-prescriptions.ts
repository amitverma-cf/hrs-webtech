"use client";

import { useState, useCallback, useEffect } from "react";
import { Prescription } from "@/lib/schemas";

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clinical/prescriptions/pending");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrescriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prescriptions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = async (id: string, status: "dispensed" | "rejected") => {
    try {
      const res = await fetch(`/api/clinical/prescriptions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchPending();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchPending());
  }, [fetchPending]);

  return { prescriptions, isLoading, error, updateStatus, refresh: fetchPending };
}
