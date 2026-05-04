"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { AuditLogTable } from "@/components/audit-log-table";
import { ClipboardList } from "lucide-react";

export default function AdminAuditPage() {
  const { auditLogs, isLoading, fetchAuditLogs } = useAdmin();

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Audit Trail</h1>
          <p className="text-muted-foreground">Immutable logs of all system and clinical activities for compliance.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        {isLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Retrieving audit trail...</p>
          </div>
        ) : (
          <AuditLogTable logs={auditLogs} />
        )}
      </div>
    </div>
  );
}
