"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/lib/schemas";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (status = "pending", wardId?: string) => {
    setIsLoading(true);
    try {
      const url = new URL("/api/clinical/tasks", window.location.origin);
      url.searchParams.set("status", status);
      if (wardId) url.searchParams.set("wardId", wardId);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = async (id: string, status: string, result?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/clinical/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, result }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createAdHocTask = async (data: Partial<Task> & { patientId: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clinical/tasks/ad-hoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { tasks, isLoading, error, updateTask, fetchTasks, createAdHocTask, refresh: fetchTasks };
}

export function useSafetyBrief(patientId: string | null) {
  const [brief, setBrief] = useState<{ 
    allergies: string[]; 
    lastVitals?: {
      temperature: number;
      spO2: number;
      bloodPressure: string;
    };
    thresholds?: { metric: string; min?: number; max?: number; urgent: boolean }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrief = useCallback(async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/safety-brief`);
      const data = await res.json();
      if (res.ok) setBrief(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    Promise.resolve().then(() => fetchBrief());
  }, [fetchBrief]);

  return { brief, isLoading };
}
