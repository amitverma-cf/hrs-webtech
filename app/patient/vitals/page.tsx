"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useVitals } from "@/hooks/use-vitals";
import { VitalLog } from "@/lib/schemas";
import { Activity, ClipboardList, Filter, Download, Thermometer, HeartPulse, Droplets, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function PatientVitalsPage() {
  const { user } = useAuth();
  const { vitals, fetchVitals, isLoading } = useVitals();

  useEffect(() => {
    if (user?.id) {
      fetchVitals(user.id);
    }
  }, [user, fetchVitals]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Vitals Archive</h1>
            <p className="text-muted-foreground font-medium italic">Verified clinical telemetry and biometric logs.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2">
                <Download className="h-4 w-4" />
                Export Health Data
            </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Telemetry Record</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Logged during inpatient care</CardDescription>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Syncing telemetry data...</p>
            </div>
          ) : vitals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Date & Time</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-rose-600"><HeartPulse className="h-3 w-3 inline mr-1" /> Cardiac</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-primary">Pressure</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-info"><Droplets className="h-3 w-3 inline mr-1" /> Oxygen</TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-orange-600"><Thermometer className="h-3 w-3 inline mr-1" /> Thermal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vitals.map((v: VitalLog, idx: number) => (
                    <TableRow key={idx} className="hover:bg-muted/10 transition-colors border-b last:border-0 group">
                      <TableCell className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground/80">{v.recordedAt ? new Date(v.recordedAt).toLocaleDateString() : '—'}</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter flex items-center gap-1">
                                <Clock className="h-2 w-2" />
                                {v.recordedAt ? new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-lg text-rose-600">{v.heartRate} <span className="text-[10px] uppercase">BPM</span></TableCell>
                      <TableCell className="font-black text-lg text-primary">{v.bloodPressure}</TableCell>
                      <TableCell className="font-black text-lg text-info">{v.spO2}%</TableCell>
                      <TableCell className="px-8 text-right font-black text-lg text-orange-600">{v.temperature}°C</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-32 space-y-4">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ClipboardList className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <div className="max-w-xs mx-auto">
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No Data Found</p>
                  <p className="text-sm text-muted-foreground font-medium italic mt-1">Bedside telemetry from clinical staff will be automatically synchronized here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
