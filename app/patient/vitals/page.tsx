"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useVitals } from "@/hooks/use-vitals";
import { Activity, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PatientVitalsPage() {
  const { user } = useAuth();
  const { vitals, fetchVitals, isLoading } = useVitals();

  useEffect(() => {
    if (user?.userId) {
      fetchVitals(user.userId);
    }
  }, [user, fetchVitals]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Activity className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vitals History</h1>
          <p className="text-muted-foreground">Detailed record of your clinical vitals logged during your hospital sessions.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : vitals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>SpO2</TableHead>
                <TableHead>Temperature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitals.map((v: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{new Date(v.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{v.heartRate} BPM</TableCell>
                  <TableCell>{v.bloodPressure}</TableCell>
                  <TableCell>{v.spO2}%</TableCell>
                  <TableCell>{v.temperature}°C</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-20">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto opacity-20 mb-4" />
            <p className="text-muted-foreground font-medium">No vitals history found.</p>
            <p className="text-sm text-muted-foreground">Vitals logged by nursing staff will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
