"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/use-patients";
import { VitalLog } from "@/lib/schemas";
import { useVitals } from "@/hooks/use-vitals";
import { PatientTable } from "@/components/patient-table";
import { VitalsForm } from "@/components/forms/vitals-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Activity, Search, Filter, Thermometer } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NurseVitalsPage() {
  const { patients, isLoading: patientsLoading } = usePatients();
  const { logVitals, isLoading: vitalsLoading } = useVitals();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogVitals = async (data: VitalLog) => {
    try {
      await logVitals(data);
      toast.success("Vitals logged successfully");
      setSelectedPatientId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to log vitals");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Vitals Intake</h1>
            <p className="text-muted-foreground font-medium">High-fidelity biometric logging and telemetry capture.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2">
            <Thermometer className="h-4 w-4" />
            Baseline Trends
          </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Care Queue</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Select a patient for clinical logging</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter patients..."
                className="pl-9 h-11 w-[250px] bg-muted/50 border-none rounded-xl font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {patientsLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Retrieving patient directory...</p>
            </div>
          ) : (
            <PatientTable
              patients={filteredPatients}
              onViewDetails={(id) => setSelectedPatientId(id)}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedPatientId} onOpenChange={() => setSelectedPatientId(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <Activity className="h-40 w-40" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">Log Bedside Vitals</DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-medium">Syncing live telemetry to the clinical record.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8">
            {selectedPatientId && (
              <VitalsForm
                patientId={selectedPatientId}
                onSubmit={handleLogVitals}
                isLoading={vitalsLoading}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
