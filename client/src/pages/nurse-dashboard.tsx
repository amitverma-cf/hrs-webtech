import { useState } from "react";
import { usePatients } from "../hooks/use-patients";
import { useVitals } from "../hooks/use-vitals";
import { useAuth } from "../hooks/use-auth";
import { PatientTable } from "../components/patient-table";
import { VitalsForm } from "../components/forms/vitals-form";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LogOut, Activity, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function NurseDashboard() {
  const { patients, isLoading: patientsLoading } = usePatients();
  const { logVitals, isLoading: vitalsLoading } = useVitals();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
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
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Nurse Dashboard</h1>
            <p className="text-sm text-muted-foreground">Clinical Care: {user?.role}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Active Patients</h2>
        </div>

        {patientsLoading ? (
          <div className="text-center py-10 text-muted-foreground">Retrieving patient records...</div>
        ) : (
          <PatientTable 
            patients={patients} 
            onViewDetails={(id) => navigate(`/patients/${id}`)} 
          />
        )}
      </main>

      <Dialog open={!!selectedPatientId} onOpenChange={() => setSelectedPatientId(null)}>
        <DialogContent className="sm:max-w-[425px]">
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
