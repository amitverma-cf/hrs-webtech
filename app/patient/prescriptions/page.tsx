"use client";

import { usePrescriptions } from "@/hooks/use-prescriptions";
import { Prescription } from "@/lib/schemas";
import { Pill, ClipboardList, Filter, Clock, CheckCircle2, Calendar, ShieldCheck, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PatientPrescriptionsPage() {
  const { prescriptions, isLoading } = usePrescriptions();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Pill className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Prescription Log</h1>
            <p className="text-muted-foreground font-medium italic">Active pharmacological protocols and medication history.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2">
                <ShieldCheck className="h-4 w-4" />
                Safety Guidelines
            </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-card p-6 rounded-[2rem] border-none shadow-sm">
         <div className="flex items-center gap-4">
            <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                {prescriptions.length} Active Orders
            </Badge>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground font-medium">Syncing pharmacy records...</p>
          </div>
        ) : prescriptions.length > 0 ? (
          prescriptions.map((p: Prescription) => (
            <Card key={p.id} className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card hover:shadow-muted/40 transition-all group">
              <CardHeader className="bg-muted/5 border-b pb-6 px-8 pt-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Pill className="h-5 w-5 text-primary" />
                        </div>
                        {p.medicationName}
                    </CardTitle>
                    <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Order Ref: RX-{p.id?.substring(0, 6).toUpperCase() || 'NEW'}</CardDescription>
                  </div>
                  <Badge 
                    variant={p.status === "dispensed" ? "default" : "secondary"}
                    className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider ${p.status === 'dispensed' ? 'bg-success/10 text-success hover:bg-success/20 border-success/20' : ''}`}
                  >
                    {p.status === 'dispensed' ? (
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Dispensed</span>
                    ) : (
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {p.status}</span>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter flex items-center gap-1.5">
                    <Activity className="h-3 w-3" /> Dosage protocol
                  </p>
                  <p className="text-xl font-black text-foreground/80">{p.dosage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Frequency
                  </p>
                  <p className="text-xl font-black text-foreground/80">{p.frequency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Course Duration
                  </p>
                  <p className="text-xl font-black text-foreground/80">{p.duration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" /> Date Validated
                  </p>
                  <p className="text-xl font-black text-foreground/80">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
            <div className="col-span-full text-center py-32 space-y-4">
                <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <ClipboardList className="h-10 w-10 text-muted-foreground opacity-20" />
                </div>
                <div className="max-w-xs mx-auto">
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No active orders</p>
                    <p className="text-sm text-muted-foreground font-medium italic mt-1">Your pharmacological history will be automatically updated here by clinical staff.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
