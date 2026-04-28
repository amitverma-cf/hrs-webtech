import { useState, useCallback, useEffect } from "react";
import { prescriptionService } from "../services/prescription.service";

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await prescriptionService.getPending();
      setPrescriptions(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch prescriptions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = async (id: string, status: "dispensed" | "rejected") => {
    try {
      await prescriptionService.updateStatus(id, status);
      await fetchPending();
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to update status";
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return { prescriptions, isLoading, error, updateStatus, refresh: fetchPending };
}
