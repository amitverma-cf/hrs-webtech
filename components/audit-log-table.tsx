import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, FileJson } from "lucide-react";
import { AuditLog } from "@/lib/schemas";

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Timestamp</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">User Context</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Event Action</TableHead>
            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Resource Scope</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/10 transition-colors border-b last:border-0 group">
              <TableCell className="px-8 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground/80">{new Date(log.timestamp).toLocaleDateString()}</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-info/10 flex items-center justify-center text-info shadow-inner">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">
                    {log.performedBy === "system" ? "CRON_SYSTEM" : `USER-${log.performedBy.split("-")[0].toUpperCase()}`}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full border-primary/20 bg-primary/5 text-primary">
                    {log.action}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-8">
                <div className="flex items-center gap-2 font-bold text-xs text-muted-foreground">
                  <FileJson className="h-3 w-3" />
                  {log.resourceType.toUpperCase()}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-24 text-muted-foreground font-medium">
                No immutable audit entries recorded in the current partition.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
