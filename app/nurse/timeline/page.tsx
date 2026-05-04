"use client";

import { usePatients } from "@/hooks/use-patients";
import { PatientTable } from "@/components/patient-table";
import { ClipboardList, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function NurseTimelinePage() {
  const { patients, isLoading } = usePatients();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Timeline</h1>
          <p className="text-muted-foreground">Select a patient to view their chronological care history and medication timeline.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Select Patient</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter patients..." className="pl-9 rounded-lg" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        ) : (
          <PatientTable 
            patients={patients} 
            onViewDetails={(id) => router.push(`/patients/${id}`)} 
          />
        )}
      </div>
    </div>
  );
}
