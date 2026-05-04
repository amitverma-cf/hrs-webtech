"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { UserManagementList } from "@/components/user-management-list";
import { AuditLogTable } from "@/components/audit-log-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Users, History } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { users, auditLogs, isLoading, fetchUsers, fetchAuditLogs, toggleUserStatus } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, [fetchUsers, fetchAuditLogs]);

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
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}. Manage staff and view clinical trails.</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="users" className="flex items-center gap-2 rounded-lg px-4">
            <Users className="h-4 w-4" />
            Staff Management
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2 rounded-lg px-4">
            <History className="h-4 w-4" />
            Clinical Audit Trail
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">System Users</h2>
            {isLoading ? (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Syncing user directory...</p>
              </div>
            ) : (
              <UserManagementList users={users} onToggleStatus={handleToggle} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Immutable Audit Logs</h2>
            {isLoading ? (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Retrieving audit trail...</p>
              </div>
            ) : (
              <AuditLogTable logs={auditLogs} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
