"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { UserManagementList } from "@/components/user-management-list";
import { Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { users, isLoading, fetchUsers, toggleUserStatus } = useAdmin();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      await toggleUserStatus(id, currentStatus);
      toast.success("Staff status updated");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage system users, clinical staff, and their account statuses.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        {isLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Syncing user directory...</p>
          </div>
        ) : (
          <UserManagementList users={users} onToggleStatus={handleToggle} />
        )}
      </div>
    </div>
  );
}
