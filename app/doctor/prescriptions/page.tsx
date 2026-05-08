"use client";

import { usePrescriptions } from "@/hooks/use-prescriptions";
import { PlusCircle, Search, Filter, Stethoscope, Clock, CheckCircle2 } from "lucide-react";
import { Prescription } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DoctorPrescriptionsPage() {
  const { prescriptions, isLoading } = usePrescriptions();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Prescription Review</h1>
            <p className="text-muted-foreground font-medium">Pharmacological order history and dispensing lifecycle tracking.</p>
          </div>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2 font-bold">
          <PlusCircle className="h-5 w-5" />
          Issue New Rx
        </Button>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Clinical Order Log</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Tracking {prescriptions.length} historical dispensations</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by patient or drug..."
                className="pl-9 h-11 w-[250px] bg-muted/50 border-none rounded-xl font-medium"
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Syncing pharmacy logs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Medication Identity</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Dosage Protocol</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Dispensing Status</TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest">Verification Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((p: Prescription) => (
                    <TableRow key={p.id} className="hover:bg-muted/10 transition-colors border-b last:border-0 group">
                      <TableCell className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-lg text-foreground/80 leading-none mb-1">{p.medicationName}</span>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">RX-NODE: {p.id?.substring(0, 8).toUpperCase() || 'NEW'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground/70">{p.dosage} — {p.frequency}</span>
                          <span className="text-[10px] font-black text-muted-foreground uppercase">Duration: {p.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.status === "dispensed" ? "default" : "secondary"}
                          className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider ${p.status === 'dispensed' ? 'bg-success/10 text-success hover:bg-success/20 border-success/20' : ''}`}
                        >
                          {p.status === 'dispensed' ? (
                            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> {p.status}</span>
                          ) : (
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {p.status}</span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <span className="font-bold text-sm text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {prescriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-medium">
                        No pharmacological orders in current session logs.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
