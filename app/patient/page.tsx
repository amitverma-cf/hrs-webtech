"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePatientAdmission } from "@/hooks/use-patient-admission";
import { Task } from "@/lib/schemas";
import { 
  UserCircle, 
  Activity, 
  History, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle,
  TrendingUp,
  Download,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = usePatientAdmission();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Retrieving Clinical Session...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">My Health Record</h1>
            <p className="text-muted-foreground font-medium italic">Welcome, {user?.fullName || user?.username}.</p>
          </div>
        </div>
        <Card className="rounded-[2.5rem] border-dashed border-2 bg-muted/20">
          <CardContent className="p-24 text-center space-y-6">
            <AlertCircle className="h-16 w-12 text-muted-foreground mx-auto opacity-30" />
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-black italic">No Active Admission</h3>
              <p className="text-muted-foreground font-medium mt-2">
                You are currently not admitted to the facility. Your previous records and discharge summaries are available in the Archive section.
              </p>
              <Button className="mt-8 rounded-xl font-bold h-12 px-8 shadow-lg shadow-primary/20">Access History</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { admission, tasks, billing } = data;
  const completedTasks = tasks.filter((t: Task) => t.status === "completed").length;
  const progress = Math.round((completedTasks / tasks.length) * 100) || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Active Care Session</h1>
            <p className="text-muted-foreground font-medium italic">Monitoring your clinical progress and protocols.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Admission Node</p>
                <p className="font-bold text-foreground/80">{admission.status === "active" ? `Live since ${new Date(admission.startDate).toLocaleDateString()}` : "Session Closed"}</p>
            </div>
            {admission.status === "active" ? (
                <Badge className="bg-success hover:bg-success/90 text-success-foreground px-6 py-2 rounded-full text-sm font-black gap-2 uppercase tracking-wider shadow-lg shadow-success/20">
                    <Activity className="h-4 w-4" />
                    In-Ward Care
                </Badge>
            ) : (
                <Badge variant="secondary" className="px-6 py-2 rounded-full text-sm font-black gap-2 uppercase tracking-wider">
                    <History className="h-4 w-4" />
                    Discharged
                </Badge>
            )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Admission Info */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
          <CardHeader className="bg-muted/5 border-b pb-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Facility Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assigned Clinical Space</span>
              <div className="flex items-center gap-3">
                <span className="font-black text-4xl text-foreground/90">Room {admission.bed?.roomNumber || "—"}</span>
              </div>
              <p className="text-sm font-bold text-primary italic">Protocol: {admission.template?.name || "Standard Care"}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">Care Progress</span>
                    <span className="font-black text-3xl">{progress}%</span>
                </div>
                <div className="text-right pb-1">
                    <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
              <Progress value={progress} className="h-3 bg-muted" />
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-black">
                {completedTasks} of {tasks.length} Protocol Events Verified
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Care Analytics / Timeline */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5 pb-6">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <History className="h-5 w-5 text-primary" />
                Clinical Timeline
              </CardTitle>
              <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Real-time intervention log</CardDescription>
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-2 h-10 w-10"><Download className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-auto">
              <div className="divide-y">
                {tasks.slice(0, 15).map((task: Task) => (
                  <div key={task.id} className="p-6 flex gap-6 hover:bg-muted/5 transition-colors group">
                    <div className="mt-1">
                      {task.status === "completed" ? (
                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success shadow-inner">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground opacity-50 shadow-inner">
                            <Clock className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                            <p className={`text-lg font-bold leading-none mb-1 ${task.status === "pending" ? "text-muted-foreground/60" : "text-foreground/80"}`}>
                            {task.description}
                            </p>
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Protocol Node: {task.type}</span>
                        </div>
                        <span className="text-xs font-black text-muted-foreground bg-muted/30 px-3 py-1 rounded-full uppercase tracking-tighter">
                          {new Date(task.targetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {Boolean(task.result) && (
                        <div className="mt-3 p-3 bg-info/5 rounded-xl border border-info/10 flex items-center gap-3">
                            <Activity className="h-3 w-3 text-info" />
                            <span className="text-xs font-black text-info uppercase tracking-widest">Verified Result: {String(task.result)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="p-20 text-center text-muted-foreground italic font-medium">
                    No clinical interventions logged for this period.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Billing */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-sidebar text-sidebar-foreground md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between border-b border-sidebar-border pb-8 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">Live Billing Summary</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">Accumulated charges for current care period.</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mb-1">Total Verified Charges</p>
              <p className="text-5xl font-black text-foreground">${billing.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-sidebar-border">
                  <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clinical Item / Service</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date Logged</TableHead>
                  <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-sidebar-border hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-foreground/90">Room & Board (Intensive Care)</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Recurring Daily Rate</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-sm font-bold text-muted-foreground italic">Daily Recurring</TableCell>
                  <TableCell className="px-8 text-right font-black text-xl text-primary">${admission.bed?.dailyRate?.toFixed(2) || "0.00"}</TableCell>
                </TableRow>
                {billing.lineItems.map((item: { description: string, date: Date, amount: number }, idx: number) => (
                  <TableRow key={idx} className="border-sidebar-border hover:bg-muted/30 transition-colors group">
                    <TableCell className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-foreground/90">{item.description}</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Protocol-Driven charge</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-sm font-bold text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-8 text-right font-black text-xl text-foreground group-hover:text-primary transition-colors">${item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-8 border-t border-sidebar-border flex justify-between items-center bg-muted/20">
                <p className="text-xs text-muted-foreground font-bold max-w-md italic">This is an automated statement generated by clinical protocol fulfillment. Official invoices are issued upon discharge.</p>
                <Button variant="secondary" className="rounded-xl font-bold h-11 px-8 gap-2">
                    <Calendar className="h-4 w-4" />
                    Payment Schedule
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
