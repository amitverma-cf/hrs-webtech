"use client";

import { useState, useCallback } from "react";
import { User, Bed, DiseaseTemplate, Billing, Ward, AuditLog } from "@/lib/schemas";

export function useAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [templates, setTemplates] = useState<DiseaseTemplate[]>([]);
  const [billing, setBilling] = useState<Billing[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuditLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/beds");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBeds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch beds");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/templates");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch templates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBilling = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/billing");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBilling(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch billing");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWards = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/wards");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wards");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  const addBed = async (data: Omit<Bed, "id">) => {
    try {
      const res = await fetch("/api/admin/beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchBeds();
    } catch (err) {
      throw err;
    }
  };

  const deleteBed = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/beds/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchBeds();
    } catch (err) {
      throw err;
    }
  };

  const createTemplate = async (data: Omit<DiseaseTemplate, "id">) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error);
      }
      await fetchTemplates();
    } catch (err) {
      throw err;
    }
  };

  return { 
    users, 
    auditLogs, 
    beds,
    templates,
    billing,
    wards,
    isLoading, 
    error, 
    fetchUsers, 
    fetchAuditLogs, 
    fetchBeds,
    fetchTemplates,
    fetchBilling,
    fetchWards,
    updateUser,
    deleteUser,
    addBed,
    deleteBed,
    createTemplate,
    deleteTemplate
  };
}
