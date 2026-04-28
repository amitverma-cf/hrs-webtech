import { useEffect } from "react";
import { useAdmin } from "../hooks/use-admin";
import { useAuth } from "../hooks/use-auth";
import { UserManagementList } from "../components/user-management-list";
import { AuditLogTable } from "../components/audit-log-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, Users, History } from "lucide-react";
import { toast } from "sonner";

export function AdminDashboard() {
  const { users, auditLogs, isLoading, fetchUsers, fetchAuditLogs, toggleUserStatus } = useAdmin();
  const { logout, user } = useAuth();

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
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">System Administration</h1>
              <p className="text-sm text-muted-foreground">Admin: {user?.username}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff Management
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Clinical Audit Trail
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <h2 className="text-2xl font-bold">System Users</h2>
            {isLoading ? (
              <div className="text-center py-10">Syncing user directory...</div>
            ) : (
              <UserManagementList users={users} onToggleStatus={handleToggle} />
            )}
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <h2 className="text-2xl font-bold">Immutable Audit Logs</h2>
            {isLoading ? (
              <div className="text-center py-10">Retrieving audit trail...</div>
            ) : (
              <AuditLogTable logs={auditLogs} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
