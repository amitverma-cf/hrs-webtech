"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { AuditLogTable } from "@/components/audit-log-table";
import { ClipboardList, Search, Filter, Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminAuditPage() {
  const { auditLogs, isLoading, fetchAuditLogs } = useAdmin();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.resourceType.toLowerCase().includes(search.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">System Audit</h1>
            <p className="text-muted-foreground font-medium italic">Immutable compliance logs and clinical event tracking.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20 h-11 font-bold gap-2">
            <History className="h-4 w-4" />
            Retention Policy
          </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Activity Log</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Monitoring {auditLogs.length} verified events</CardDescription>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter logs..." 
                  className="pl-9 h-11 w-[250px] bg-muted/50 border-none rounded-xl font-medium" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Syncing audit database...</p>
            </div>
          ) : (
            <AuditLogTable logs={filteredLogs} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
