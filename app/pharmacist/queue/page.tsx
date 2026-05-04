"use client";

import { usePrescriptions } from "@/hooks/use-prescriptions";
import { PrescriptionQueue } from "@/components/prescription-queue";
import { Pill, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function PharmacistQueuePage() {
  const { prescriptions, isLoading, updateStatus } = usePrescriptions();

  const handleAction = async (id: string, status: "dispensed" | "rejected") => {
    try {
      await updateStatus(id, status);
      toast.success(`Prescription successfully ${status}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Pill className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispensing Queue</h1>
          <p className="text-muted-foreground">Manage and process active medication orders from clinical staff.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Orders</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter by ID or patient..." className="pl-9 rounded-lg" />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Syncing dispensing queue...</p>
          </div>
        ) : (
          <PrescriptionQueue 
            prescriptions={prescriptions} 
            onAction={handleAction} 
          />
        )}
      </div>
    </div>
  );
}
