import { usePatients } from "../hooks/use-patients";
import { useAuth } from "../hooks/use-auth";
import { PatientTable } from "../components/patient-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DoctorDashboard() {
  const { patients, isLoading } = usePatients();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Doctor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Logged in as {user?.role}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Loading patients...</div>
        ) : (
          <PatientTable 
            patients={patients} 
            onViewDetails={(id) => navigate(`/patients/${id}`)} 
          />
        )}
      </main>
    </div>
  );
}
