"use client";

import { usePatients } from "@/hooks/use-patients";
import { useAuth } from "@/hooks/use-auth";
import { PatientTable } from "@/components/patient-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Stethoscope, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function DoctorDashboard() {
  const { patients, isLoading } = usePatients();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. {user?.username}. You have {patients.length} patients under your care.</p>
          </div>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Patient
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Patient Directory</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-9 rounded-lg" />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading patient records...</p>
            </div>
          ) : (
            <PatientTable 
              patients={patients} 
              onViewDetails={(id) => router.push(`/patients/${id}`)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
