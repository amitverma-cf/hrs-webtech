"use client";

import { usePrescriptions } from "@/hooks/use-prescriptions";
import { Pill, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PatientPrescriptionsPage() {
  const { prescriptions, isLoading } = usePrescriptions();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Pill className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
          <p className="text-muted-foreground">View your active medication and prescription history.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : prescriptions.length > 0 ? (
          prescriptions.map((p: any) => (
            <Card key={p.id} className="rounded-2xl shadow-sm border overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    {p.medicationName}
                  </CardTitle>
                  <Badge variant={p.status === "dispensed" ? "default" : "secondary"}>
                    {p.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Dosage</p>
                  <p className="text-lg font-medium">{p.dosage}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Frequency</p>
                  <p className="text-lg font-medium">{p.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Duration</p>
                  <p className="text-lg font-medium">{p.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Date Prescribed</p>
                  <p className="text-lg font-medium">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-card border rounded-2xl border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto opacity-20 mb-4" />
            <p className="text-muted-foreground font-medium">No prescriptions found.</p>
            <p className="text-sm text-muted-foreground">Your active medications will appear here once prescribed by a doctor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
