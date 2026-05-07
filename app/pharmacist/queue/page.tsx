"use client";

import { usePrescriptions } from "@/hooks/use-prescriptions";
import { PrescriptionQueue } from "@/components/prescription-queue";
import { Pill, Search, Filter, History } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PharmacistQueuePage() {
  const { prescriptions, isLoading, updateStatus } = usePrescriptions();

  const handleAction = async (id: string, status: "dispensed" | "rejected") => {
    try {
      await updateStatus(id, status);
      toast.success(`Prescription successfully ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Pill className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Dispensing Logic</h1>
            <p className="text-muted-foreground font-medium italic">Pharmacological order management and verification.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2">
                <History className="h-4 w-4" />
                Dispense History
            </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Active Medication Orders</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Verifying {prescriptions.length} pending requests</CardDescription>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by ID or Drug..." 
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
              <p className="text-muted-foreground font-medium">Syncing dispensing queue...</p>
            </div>
          ) : (
            <PrescriptionQueue 
              prescriptions={prescriptions} 
              onAction={handleAction} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
