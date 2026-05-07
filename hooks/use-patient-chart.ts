"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Patient, VitalLog, Admission, AdmissionWithDetails } from "@/lib/schemas";

export function usePatientChart(patientId: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalLog[]>([]);
  const [activeAdmission, setActiveAdmission] = useState<AdmissionWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChart = useCallback(async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const [pRes, vRes, aRes] = await Promise.all([
        fetch(`/api/patients/${patientId}`),
        fetch(`/api/clinical/vitals/${patientId}`),
        fetch(`/api/clinical/admissions`)
      ]);
      
      const pData = await pRes.json();
      const vData = await vRes.json();
      const aData = await aRes.json();

      if (!pRes.ok) throw new Error(pData.error);
      if (!vRes.ok) throw new Error(vData.error);
      if (!aRes.ok) throw new Error(aData.error);

      setPatient(pData);
      setVitals(vData);
      
      const active = aData.find((a: Admission) => a.patientId === patientId && a.status === "active");
      setActiveAdmission(active);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch chart");
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    Promise.resolve().then(() => fetchChart());
  }, [fetchChart]);

  const dischargePatient = async () => {
    if (!activeAdmission) return;
    try {
      const res = await fetch(`/api/clinical/admissions/${activeAdmission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "discharged" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      await fetchChart();
    } catch (err) {
      throw err;
    }
  };

  const timelineEvents = useMemo(() => {
    const events: {
      id: string;
      type: "vital" | "prescription" | "note";
      date: string;
      title: string;
      description: string;
      metadata: Record<string, string>;
    }[] = [];

    // Add vitals to timeline
    vitals.forEach((v, idx) => {
      events.push({
        id: v.id || `vital-${v.recordedAt?.getTime() || idx}`,
        type: "vital",
        date: v.recordedAt ? v.recordedAt.toISOString() : new Date().toISOString(),
        title: "Vitals Recorded",
        description: `Temp: ${v.temperature}°C, BP: ${v.bloodPressure}`,
        metadata: { SpO2: `${v.spO2}%`, HR: `${v.heartRate} BPM` }
      });
    });

    return events.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });
  }, [vitals]);

  return { patient, timelineEvents, activeAdmission, isLoading, error, dischargePatient, refresh: fetchChart };
}
