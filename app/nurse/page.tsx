"use client";

import { useState } from "react";
import { usePatients } from "@/hooks/use-patients";
import { useVitals } from "@/hooks/use-vitals";
import { useAuth } from "@/hooks/use-auth";
import { PatientTable } from "@/components/patient-table";
import { VitalsForm } from "@/components/forms/vitals-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Activity, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NurseDashboard() {
  const { patients, isLoading: patientsLoading } = usePatients();
  const { logVitals, isLoading: vitalsLoading } = useVitals();
  const { user } = useAuth();
  const router = useRouter();
  
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
          <h1 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}. Monitoring clinical vitals and care timelines.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Active Patients
          </h2>
        </div>

        {patientsLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Retrieving patient records...</p>
          </div>
        ) : (
          <PatientTable 
            patients={patients} 
            onViewDetails={(id) => router.push(`/patients/${id}`)} 
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
