import { useState, useEffect, useCallback } from "react";
import { patientService } from "../services/patient.service";

export function usePatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch patients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPatient = async (data: any) => {
    setIsLoading(true);
    try {
      await patientService.createPatient(data);
      await fetchPatients();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create patient");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, isLoading, error, createPatient, refresh: fetchPatients };
}
