"use client";

import { useState, useEffect } from "react";
import { usePatients } from "@/hooks/use-patients";
import { useAdmin } from "@/hooks/use-admin";
import { useTasks } from "@/hooks/use-tasks";
import { PatientRegistrationForm } from "@/components/forms/patient-registration-form";
import { Button } from "@/components/ui/button";
import { Users, Search, BedDouble, ClipboardPlus, Filter, UserPlus, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Patient, DiseaseTemplate } from "@/lib/schemas";

export default function DoctorPatientsPage() {
  const { patients, isLoading: patientsLoading, createPatient, admitPatient } = usePatients();
  const { templates, fetchTemplates } = useAdmin();
  const { createAdHocTask } = useTasks();
  const router = useRouter();

  const [isRegOpen, setIsRegOpen] = useState(false);
  const [isAdmitOpen, setIsAdmitOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ad-hoc Order State
  const [orderType, setOrderType] = useState<"medication" | "metric">("medication");
  const [orderDesc, setOrderDesc] = useState("");
  const [orderPriority, setOrderPriority] = useState<"normal" | "high" | "urgent">("normal");

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleRegister = async (data: Partial<Patient>) => {
    setIsSubmitting(true);
    try {
      await createPatient(data);
      toast.success("Patient registered successfully");
      setIsRegOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdmit = async () => {
    if (!selectedPatient || !selectedTemplateId) return;
    setIsSubmitting(true);
    try {
      const res = await admitPatient(selectedPatient.id!, selectedTemplateId);
      toast.success(`Patient admitted to Room ${res.roomNumber}`);
      setIsAdmitOpen(false);
      setSelectedPatient(null);
      setSelectedTemplateId("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Admission failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedPatient || !orderDesc) return;
    setIsSubmitting(true);
    try {
      await createAdHocTask({
        patientId: selectedPatient.id!,
        type: orderType,
        description: orderDesc,
        targetTime: new Date(),
        priority: orderPriority
      });
      toast.success("Ad-hoc order issued successfully");
      setIsOrderOpen(false);
      setOrderDesc("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to issue order";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Patient Registry</h1>
            <p className="text-muted-foreground font-medium">Clinical demographics and ward admission control.</p>
          </div>
        </div>
        <Button onClick={() => setIsRegOpen(true)} className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2 font-bold">
          <UserPlus className="h-5 w-5" />
          Onboard Patient
        </Button>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Directory Listing</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Managing {patients.length} registered profiles</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-9 h-11 w-[250px] bg-muted/50 border-none rounded-xl font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {patientsLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Syncing database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Patient Identity</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Clinical Context</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Care Status</TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/10 transition-colors border-b last:border-0 group">
                      <TableCell className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-lg text-foreground/80 leading-none mb-1">{p.fullName}</span>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">ID: {p.id?.substring(0, 8).toUpperCase() || 'NEW'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold capitalize">{p.gender}</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Demographic</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider bg-info/5 text-info border-info/20">
                          Registered
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl h-10 px-4 font-black text-[10px] uppercase gap-2 border-2 hover:bg-muted"
                            onClick={() => { setSelectedPatient(p); setIsOrderOpen(true); }}
                          >
                            <ClipboardPlus className="h-4 w-4" />
                            New Order
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-xl h-10 px-4 font-black text-[10px] uppercase gap-2 shadow-lg shadow-primary/10"
                            onClick={() => { setSelectedPatient(p); setIsAdmitOpen(true); }}
                          >
                            <BedDouble className="h-4 w-4" />
                            Admit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-muted"
                            onClick={() => router.push(`/patients/${p.id}`)}
                          >
                            <ArrowUpRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-medium">
                        No clinical records found in this scope.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={isRegOpen} onOpenChange={setIsRegOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <UserPlus className="h-40 w-40" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">Onboard New Patient</DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-medium">Create a new clinical identity in the facility database.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8">
            <PatientRegistrationForm onSubmit={handleRegister} isLoading={isSubmitting} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Admission Dialog */}
      <Dialog open={isAdmitOpen} onOpenChange={setIsAdmitOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <BedDouble className="h-40 w-40" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">Ward Admission</DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-medium">Assign a clinical protocol and room for this session.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-8">
            <div className="p-6 bg-muted rounded-3xl space-y-1 relative overflow-hidden">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">Target Patient</span>
              <p className="font-black text-2xl text-foreground/90 relative z-10">{selectedPatient?.fullName}</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="template" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Disease Protocol (Clinical Template)</Label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger id="template" className="rounded-2xl h-14 bg-muted border-none font-black text-lg">
                  <SelectValue placeholder="Select Clinical logic..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {templates.map((t: DiseaseTemplate) => (
                    <SelectItem key={t.id} value={t.id} className="rounded-xl font-bold py-3">{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1 rounded-2xl h-14 font-bold text-muted-foreground" onClick={() => setIsAdmitOpen(false)}>Abort</Button>
              <Button
                className="flex-[2] rounded-2xl h-14 shadow-2xl shadow-primary/20 gap-3 text-xl font-black"
                disabled={!selectedTemplateId || isSubmitting}
                onClick={handleAdmit}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle2 className="h-6 w-6" />
                    Execute Admission
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ad-Hoc Order Dialog */}
      <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <ClipboardPlus className="h-40 w-40" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">Clinical Order</DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-medium">Issue an immediate medication or metric instruction.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Protocol Instruction Type</Label>
              <div className="flex gap-2 p-1 bg-muted rounded-2xl">
                <Button variant={orderType === 'medication' ? 'default' : 'ghost'} className={`flex-1 rounded-xl h-12 font-black text-xs uppercase ${orderType === 'medication' ? 'shadow-sm' : ''}`} onClick={() => setOrderType('medication')}>Medication</Button>
                <Button variant={orderType === 'metric' ? 'default' : 'ghost'} className={`flex-1 rounded-xl h-12 font-black text-xs uppercase ${orderType === 'metric' ? 'shadow-sm' : ''}`} onClick={() => setOrderType('metric')}>Telemetry</Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="desc" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Order Detail / Instructions</Label>
              <Input id="desc" value={orderDesc} onChange={(e) => setOrderDesc(e.target.value)} placeholder={orderType === 'medication' ? "e.g. Paracetamol 500mg Stat" : "e.g. Daily ECG"} className="rounded-2xl h-14 bg-muted border-none font-black text-lg text-foreground/90" />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Execution Priority</Label>
              <Select value={orderPriority} onValueChange={(val) => setOrderPriority(val as "normal" | "high" | "urgent")}>
                <SelectTrigger className="rounded-2xl h-14 bg-muted border-none font-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="normal" className="rounded-xl font-bold py-3">Routine Execution</SelectItem>
                  <SelectItem value="high" className="rounded-xl font-bold py-3 text-warning">High Priority</SelectItem>
                  <SelectItem value="urgent" className="rounded-xl font-black py-3 text-destructive">STAT / URGENT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="ghost" className="flex-1 rounded-2xl h-14 font-bold text-muted-foreground" onClick={() => setIsOrderOpen(false)}>Abort</Button>
              <Button className="flex-[2] rounded-2xl h-14 shadow-2xl shadow-primary/20 gap-3 text-xl font-black" onClick={handleCreateOrder} disabled={isSubmitting || !orderDesc}>
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Issue Protocol"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

