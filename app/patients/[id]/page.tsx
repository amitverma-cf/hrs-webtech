"use client";

import { use, useState } from "react";
import { usePatientChart } from "@/hooks/use-patient-chart";
import { useAuth } from "@/hooks/use-auth";
import { ClinicalTimeline } from "@/components/clinical-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Printer, User, LogOut, Clock, HeartPulse, History, ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PatientChartView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { patient, timelineEvents, activeAdmission, isLoading, dischargePatient } = usePatientChart(id);
  const { user } = useAuth();
  const [isDischarging, setIsDischarging] = useState(false);

  const handleDischarge = async () => {
    if (!confirm("Are you sure you want to discharge this patient? This will free their bed and cancel pending tasks.")) return;
    setIsDischarging(true);
    try {
      await dischargePatient();
      toast.success("Patient discharged successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDischarging(false);
    }
  };

  const [isRefilling, setIsRefilling] = useState(false);

  const handleRefill = async () => {
    if (!activeAdmission) return;
    setIsRefilling(true);
    try {
      const res = await fetch(`/api/clinical/admissions/${activeAdmission.id}/refill`, { method: 'POST' });
      if (res.ok) {
        toast.success("Care protocol extended for another 48 hours");
      } else {
        throw new Error("Failed to extend protocol");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to extend protocol");
    } finally {
      setIsRefilling(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex h-[80vh] items-center justify-center flex-col gap-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Accessing Patient Chart...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-4 border-primary/10 shadow-lg">
                <AvatarImage src={`https://avatar.vercel.sh/${id}`} />
                <AvatarFallback className="bg-primary/5 text-primary font-black text-xl">{patient?.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-black tracking-tight">{patient?.fullName}</h1>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">PAT-NODE: {id.substring(0, 8).toUpperCase()}</span>
                    <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider bg-info/5 text-info border-info/20">
                        Verified Identity
                    </Badge>
                </div>
              </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            {activeAdmission && (user?.role === "doctor" || user?.role === "admin") && (
              <>
                <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2" onClick={handleRefill} disabled={isRefilling}>
                    <Clock className="h-4 w-4" />
                    {isRefilling ? "Processing..." : "Refill Protocol"}
                </Button>
                <Button variant="destructive" className="rounded-xl h-11 font-black gap-2 px-6 shadow-lg shadow-destructive/20" onClick={handleDischarge} disabled={isDischarging}>
                    <LogOut className="h-4 w-4" />
                    {isDischarging ? "Processing..." : "Execute Discharge"}
                </Button>
              </>
            )}
            <Button variant="outline" className="rounded-xl border-2 h-11 font-bold gap-2" onClick={() => window.open(`/discharge/${id}`, "_blank")}>
              <Download className="h-4 w-4" />
              Summary
            </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Demographics & Admission Status */}
        <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
                <CardHeader className="bg-muted/5 border-b pb-6 px-8 pt-8">
                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                        <User className="h-5 w-5 text-primary" />
                        Clinical Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Legal Identity</label>
                            <p className="font-bold text-lg text-foreground/80">{patient?.fullName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Gender</label>
                                <p className="font-bold capitalize">{patient?.gender}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Date of Birth</label>
                                <p className="font-bold">{patient?.dateOfBirth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-muted">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Admission Node</p>
                                <p className="text-sm font-black italic">{activeAdmission ? "LIVE SESSION" : "CLOSED SESSION"}</p>
                             </div>
                             <div className={`h-3 w-3 rounded-full ${activeAdmission ? 'bg-success animate-pulse' : 'bg-muted-foreground/30'}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {activeAdmission && (
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-primary text-primary-foreground relative">
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                        <HeartPulse className="h-40 w-40" />
                    </div>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-black italic">Active Ward Context</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Assigned Clinical Space</p>
                            <p className="text-4xl font-black">Room {activeAdmission.bed?.roomNumber || '—'}</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase opacity-60">Fulfillment Logic</p>
                            <p className="text-sm font-bold mt-1">{activeAdmission.template?.name}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Right Column: Life Stream / Timeline */}
        <div className="md:col-span-2">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card h-full min-h-[600px]">
                <CardHeader className="bg-muted/5 border-b pb-6 px-8 pt-8 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-xl font-black">
                            <History className="h-5 w-5 text-primary" />
                            Clinical Life Stream
                        </CardTitle>
                        <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1 italic">Immutable chronological care log</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl"><Printer className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent className="p-8">
                    <ClinicalTimeline events={timelineEvents} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
