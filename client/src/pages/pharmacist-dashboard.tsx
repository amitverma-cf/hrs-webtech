import { usePrescriptions } from "../hooks/use-prescriptions";
import { useAuth } from "../hooks/use-auth";
import { PrescriptionQueue } from "../components/prescription-queue";
import { Button } from "@/components/ui/button";
import { LogOut, Package2 } from "lucide-react";
import { toast } from "sonner";

export function PharmacistDashboard() {
  const { prescriptions, isLoading, updateStatus } = usePrescriptions();
  const { logout, user } = useAuth();

  const handleAction = async (id: string, status: "dispensed" | "rejected") => {
    try {
      await updateStatus(id, status);
      toast.success(`Prescription successfully ${status}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Pharmacist Dashboard</h1>
              <p className="text-sm text-muted-foreground">User: {user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dispensing Queue</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Updating queue...</div>
        ) : (
          <PrescriptionQueue 
            prescriptions={prescriptions} 
            onAction={handleAction} 
          />
        )}
      </main>
    </div>
  );
}
