"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useVitals } from "@/hooks/use-vitals";
import { usePrescriptions } from "@/hooks/use-prescriptions";
import { UserCircle, Activity, Pill, History, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { vitals, fetchVitals, isLoading: vitalsLoading } = useVitals();
  const { prescriptions, isLoading: prescriptionsLoading } = usePrescriptions();

  useEffect(() => {
    if (user?.userId) {
      fetchVitals(user.userId);
    }
  }, [user, fetchVitals]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <UserCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Health Record</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}. Here is a summary of your health data.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm border col-span-2 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Latest Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {vitalsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : vitals.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Heart Rate</p>
                  <p className="text-2xl font-bold">{vitals[0].heartRate} <span className="text-sm font-normal">BPM</span></p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Blood Pressure</p>
                  <p className="text-2xl font-bold">{vitals[0].bloodPressure}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">SpO2</p>
                  <p className="text-2xl font-bold">{vitals[0].spO2}<span className="text-sm font-normal">%</span></p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Temp</p>
                  <p className="text-2xl font-bold">{vitals[0].temperature}<span className="text-sm font-normal">°C</span></p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <Activity className="h-10 w-10 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground italic">No bedside vitals recorded in this session.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 border rounded-xl bg-primary/5 border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Annual Checkup</p>
                  <p className="text-xs text-muted-foreground">In 2 days</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">No other scheduled events.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border col-span-3 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="h-5 w-5 text-primary" />
              Active Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {prescriptionsLoading ? (
               <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <Pill className="h-10 w-10 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground italic">No active prescriptions found.</p>
                <p className="text-xs text-muted-foreground">Contact your primary physician if this is unexpected.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
