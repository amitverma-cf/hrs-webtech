"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/use-patients";
import { useVitals } from "@/hooks/use-vitals";
import { PatientTable } from "@/components/patient-table";
import { VitalsForm } from "@/components/forms/vitals-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Activity, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function NurseVitalsPage() {
  const { patients, isLoading: patientsLoading } = usePatients();
  const { logVitals, isLoading: vitalsLoading } = useVitals();
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleLogVitals = async (data: any) => {
    try {
      await logVitals(data);
      toast.success("Vitals logged successfully");
      setSelectedPatientId(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Activity className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Vitals Entry</h1>
          <p className="text-muted-foreground">Log heart rate, blood pressure, SpO2, and temperature for active patients.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Care Queue</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-9 rounded-lg" />
          </div>
        </div>

        {patientsLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Retrieving patient directory...</p>
          </div>
        ) : (
          <PatientTable 
            patients={patients} 
            onViewDetails={(id) => setSelectedPatientId(id)} 
          />
        )}
      </div>

      <Dialog open={!!selectedPatientId} onOpenChange={() => setSelectedPatientId(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Log Bedside Vitals
            </DialogTitle>
          </DialogHeader>
          {selectedPatientId && (
            <VitalsForm 
              patientId={selectedPatientId} 
              onSubmit={handleLogVitals} 
              isLoading={vitalsLoading} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
