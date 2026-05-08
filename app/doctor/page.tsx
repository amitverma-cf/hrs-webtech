"use client";

import { useEffect, useState } from "react";
import { usePatients } from "@/hooks/use-patients";
import { AdmissionWithDetails, Bed } from "@/lib/schemas";
import { useAuth } from "@/hooks/use-auth";
import {
  Stethoscope,
  Users,
  BedDouble,
  TrendingUp,
  PlusCircle,
  Calendar,
  Activity,
  ArrowUpRight,
  ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function DoctorDashboard() {
  const { patients } = usePatients();
  const { user } = useAuth();
  const router = useRouter();
  const [admissions, setAdmissions] = useState<AdmissionWithDetails[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aRes, bRes] = await Promise.all([
          fetch("/api/clinical/admissions"),
          fetch("/api/admin/beds")
        ]);
        const aData = await aRes.json();
        const bData = await bRes.json();
        if (aRes.ok) setAdmissions(aData);
        if (bRes.ok) setBeds(bData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeAdmissions = admissions.filter(a => a.status === "active");
  const occupiedBeds = beds.filter(b => b.isOccupied).length;
  const occupancyRate = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Clinical Overview</h1>
            <p className="text-muted-foreground font-medium">Welcome back, Dr. {user?.username}. Monitoring {activeAdmissions.length} active patients.</p>
          </div>
        </div>
        <Button onClick={() => router.push('/doctor/patients')} className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2 font-bold">
          <PlusCircle className="h-5 w-5" />
          Patient Intake
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Directory</CardTitle>
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered individuals</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Care</CardTitle>
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeAdmissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium text-success">Currently admitted</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ward Capacity</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <BedDouble className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{occupancyRate}%</div>
            <div className="mt-3">
              <Progress value={occupancyRate} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{occupiedBeds} of {beds.length} beds in use</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <ClipboardList className="h-32 w-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Pending Reviews</CardTitle>
            <ClipboardList className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs mt-1 opacity-70">Protocols awaiting update</p>
            <Button variant="secondary" size="sm" className="mt-4 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 border-none text-primary-foreground text-[10px] h-7">
              Process All
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5 pb-6">
            <div>
              <CardTitle className="text-xl font-bold">Recent Admissions</CardTitle>
              <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Live Clinical Feed</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.push('/doctor/patients')}><ArrowUpRight className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-muted-foreground font-medium">Syncing clinical records...</p>
              </div>
            ) : (
              <div className="divide-y">
                {activeAdmissions.map((ad: AdmissionWithDetails) => (
                  <div key={ad.id} className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg shadow-inner">
                        {ad.bed?.roomNumber || '—'}
                      </div>
                      <div>
                        <p className="font-bold text-lg">PAT-{ad.patientId.split('-')[0].toUpperCase()}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                          <Calendar className="h-3 w-3" />
                          Admitted {new Date(ad.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider bg-success/10 text-success hover:bg-success/20 border-success/20">
                        Active Care
                      </Badge>
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">Chart</Button>
                    </div>
                  </div>
                ))}
                {activeAdmissions.length === 0 && (
                  <div className="p-20 text-center text-muted-foreground font-medium">
                    No active clinical sessions in this department.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-sidebar text-sidebar-foreground">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Rapid access to clinical modules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Button
              className="w-full justify-start gap-4 h-16 rounded-2xl bg-muted/50 hover:bg-muted border-none transition-all hover:translate-x-1 text-foreground"
              onClick={() => router.push('/doctor/patients')}
            >
              <div className="p-2 bg-info rounded-xl">
                <Users className="h-5 w-5 text-info-foreground" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Patient Registry</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Intake & Charting</p>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-4 h-16 rounded-2xl bg-muted/50 hover:bg-muted border-none transition-all hover:translate-x-1 text-foreground"
              onClick={() => router.push('/doctor/prescriptions')}
            >
              <div className="p-2 bg-primary rounded-xl">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Prescriptions</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Medication Review</p>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-4 h-16 rounded-2xl bg-muted/50 hover:bg-muted border-none transition-all hover:translate-x-1 text-foreground"
            >
              <div className="p-2 bg-success rounded-xl">
                <TrendingUp className="h-5 w-5 text-success-foreground" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Discharge</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black">Final Reports</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
