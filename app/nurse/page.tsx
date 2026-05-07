"use client";

import { useEffect, useState } from "react";
import { useTasks, useSafetyBrief } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  ShieldAlert, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  HeartPulse,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Intervention } from "@/lib/schemas";

export default function NurseDashboard() {
  const { tasks, isLoading, updateTask, fetchTasks } = useTasks();
  const { user } = useAuth();
  const { wards, fetchWards } = useAdmin();
  
  const [selectedTask, setSelectedTask] = useState<Intervention | null>(null);
  const [taskResult, setTaskResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRoom, setFilterRoom] = useState("");
  const [selectedWard, setSelectedWard] = useState<string>("all");

  const { brief, isLoading: loadingBrief } = useSafetyBrief(selectedTask?.patientId || null);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  useEffect(() => {
    fetchTasks("pending", selectedWard === "all" ? undefined : selectedWard);
  }, [fetchTasks, selectedWard]);

  const handleComplete = async () => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(selectedTask.id, "completed", selectedTask.type === "metric" ? taskResult : undefined);
      toast.success("Task completed successfully");
      setSelectedTask(null);
      setTaskResult("");
      fetchTasks("pending", selectedWard === "all" ? undefined : selectedWard);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (date: Date) => {
    return new Date(date) < new Date();
  };

  const filteredTasks = (tasks as Intervention[]).filter(t => 
    t.roomNumber?.toLowerCase().includes(filterRoom.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Ward Task Queue</h1>
            <p className="text-muted-foreground font-medium italic">Shift execution for {user?.username}. Monitoring {tasks.length} interventions.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Select value={selectedWard} onValueChange={setSelectedWard}>
                <SelectTrigger className="w-[180px] rounded-xl h-11 bg-muted/50 border-none shadow-none font-bold">
                    <SelectValue placeholder="All Wards" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="all">All Wards</SelectItem>
                    {wards.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl border-2 h-11 font-bold">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Duty Roster
            </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Scheduled Interventions</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Real-time medication & metric log</CardDescription>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by Room..." 
                  className="pl-9 h-11 w-[200px] bg-muted/50 border-none rounded-xl font-medium" 
                  value={filterRoom}
                  onChange={(e) => setFilterRoom(e.target.value)}
                />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Syncing task queue...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Target Time</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Clinical Space</TableHead>
                    <TableHead className="py-5 text-[10px) font-black uppercase tracking-widest">Instruction</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Protocol Type</TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest">Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-muted/10 transition-colors border-b last:border-0 group">
                      <TableCell className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className={`text-lg font-black ${isOverdue(task.targetTime) ? "text-destructive" : ""}`}>
                            {formatTime(task.targetTime)}
                          </span>
                          {isOverdue(task.targetTime) && (
                            <span className="text-[10px] text-destructive font-black uppercase tracking-tighter">Overdue</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-bold text-lg text-foreground/80">Room {task.roomNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            {task.priority === "urgent" && <ShieldAlert className="h-5 w-5 text-destructive animate-pulse" />}
                            <span className="font-bold text-foreground/70">{task.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                            variant={task.type === "medication" ? "secondary" : task.type === "alert" ? "destructive" : "outline"} 
                            className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider ${task.type === 'medication' ? 'bg-info/10 text-info border-info/20' : ''}`}
                        >
                          {task.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <Button 
                          size="sm" 
                          variant={task.priority === "urgent" ? "destructive" : "default"}
                          className="rounded-xl h-10 px-6 font-black shadow-lg shadow-primary/10 transition-all hover:scale-105"
                          onClick={() => setSelectedTask(task)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Execute
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                        No pending interventions for this location.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Dialog (Safety Gate) */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] overflow-hidden p-0 border-none shadow-2xl">
          <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10">
                <ShieldAlert className="h-40 w-40" />
              </div>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-3xl font-black italic">
                   Clinical Safety Gate
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Verify patient identity & safety metrics for Room {selectedTask?.roomNumber}.
                </DialogDescription>
              </DialogHeader>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-destructive/5 rounded-2xl border-none flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-destructive tracking-widest flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        Critical Allergies
                    </span>
                    {loadingBrief ? (
                        <div className="h-4 w-20 bg-destructive/10 animate-pulse rounded"></div>
                    ) : (brief?.allergies?.length || 0) > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {brief?.allergies.map((a) => (
                                <Badge key={a} className="bg-destructive text-destructive-foreground border-none text-[10px] font-black">{a}</Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm font-black text-success">SAFE: No Allergies</p>
                    )}
                </div>
                <div className="p-5 bg-info/5 rounded-2xl border-none flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-info tracking-widest flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        Vital Baseline
                    </span>
                    {loadingBrief ? (
                        <div className="h-4 w-20 bg-info/10 animate-pulse rounded"></div>
                    ) : brief?.lastVitals ? (
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-foreground/80"><Thermometer className="h-3 w-3 text-info"/> {brief.lastVitals.temperature}°C</div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-foreground/80"><Droplets className="h-3 w-3 text-info"/> {brief.lastVitals.spO2}%</div>
                            <div className="flex items-center gap-1 text-[11px] font-black text-primary"><HeartPulse className="h-3 w-3 text-primary"/> {brief.lastVitals.bloodPressure}</div>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic font-medium">No recent telemetry</p>
                    )}
                </div>
            </div>

            <div className="p-6 bg-muted rounded-3xl space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Protocol Instruction</span>
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">{selectedTask?.type}</Badge>
              </div>
              <p className="text-2xl font-black text-foreground/90 leading-tight">{selectedTask?.description}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Clock className="h-4 w-4" />
                Scheduled for {selectedTask && formatTime(selectedTask.targetTime)}
              </div>
            </div>

            {selectedTask?.type === "metric" && (
              <div className="space-y-3">
                <Label htmlFor="result" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Observation Value / Reading</Label>
                <Input 
                  id="result" 
                  placeholder="e.g. 120/80 or 37.2" 
                  value={taskResult}
                  onChange={(e) => setTaskResult(e.target.value)}
                  autoFocus
                  className="rounded-2xl h-14 bg-muted border-none font-black text-xl text-center focus:ring-4 ring-primary/10 text-foreground"
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1 rounded-2xl h-14 font-bold text-muted-foreground" onClick={() => setSelectedTask(null)}>
                Abort
              </Button>
              <Button 
                className="flex-[2] rounded-2xl h-14 shadow-2xl shadow-primary/20 gap-3 text-xl font-black"
                onClick={handleComplete}
                disabled={isSubmitting || (selectedTask?.type === "metric" && !taskResult)}
              >
                {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                        <CheckCircle2 className="h-6 w-6" />
                        Execute Task
                    </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
