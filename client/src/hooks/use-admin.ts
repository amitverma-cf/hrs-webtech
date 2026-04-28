import { useState, useCallback, useEffect } from "react";
import { adminService } from "../services/admin.service";

export function useAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      setAuditLogs(data);
    } catch (err: any) {
      setError("Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "deactivated" : "active";
    try {
      await adminService.updateUserStatus(id, newStatus);
      await fetchUsers();
    } catch (err: any) {
      throw new Error("Failed to update user status");
    }
  };

  return { users, auditLogs, isLoading, error, fetchUsers, fetchAuditLogs, toggleUserStatus };
}
