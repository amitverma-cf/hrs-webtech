import { useState, useCallback } from "react";
import { patientService } from "../services/patient.service";

export function useVitals(patientId?: string) {
  const [vitals, setVitals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVitals = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await patientService.getVitals(id);
      setVitals(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch vitals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logVitals = async (data: any) => {
    setIsLoading(true);
    try {
      await patientService.createVitalLog(data);
      if (patientId) await fetchVitals(patientId);
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to log vitals";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { vitals, isLoading, error, logVitals, fetchVitals };
}
