"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

export function usePatientChart(patientId: string) {
  const [patient, setPatient] = useState<any>(null);
  const [vitals, setVitals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChart = useCallback(async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const [pRes, vRes] = await Promise.all([
        fetch(`/api/patients/${patientId}`),
        fetch(`/api/clinical/vitals/${patientId}`)
      ]);
      
      const pData = await pRes.json();
      const vData = await vRes.json();

      if (!pRes.ok) throw new Error(pData.error);
      if (!vRes.ok) throw new Error(vData.error);

      setPatient(pData);
      setVitals(vData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const timelineEvents = useMemo(() => {
    const events: any[] = [];

    // Add vitals to timeline
    vitals.forEach(v => {
      events.push({
        id: v.id,
        type: "vital",
        date: v.recordedAt,
        title: "Vitals Recorded",
        description: `Temp: ${v.temperature}°C, BP: ${v.bloodPressure}`,
        metadata: { SpO2: `${v.spO2}%`, HR: `${v.heartRate} BPM` }
      });
    });

    // Add records to timeline (if available in patient)
    if (patient?.clinicalRecords) {
        patient.clinicalRecords.forEach((r: any) => {
            events.push({
                id: r.id,
                type: "note",
                date: r.createdAt,
                title: "Clinical Note",
                description: r.diagnosis,
                metadata: { Doctor: r.doctorName }
            });
        });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [vitals, patient]);

  return { patient, timelineEvents, isLoading, error, refresh: fetchChart };
}
