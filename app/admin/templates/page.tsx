"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { FileText, PlusCircle, Trash2, Search, Filter, Activity, Pill } from "lucide-react";
import { DiseaseTemplate } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminTemplatesPage() {
  const { templates, isLoading, fetchTemplates, deleteTemplate } = useAdmin();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(id);
        toast.success("Protocol deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete template");
      }
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Care Protocols</h1>
            <p className="text-muted-foreground font-medium italic">Deterministic care plans and disease-specific treatment logic.</p>
          </div>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2 font-bold">
          <PlusCircle className="h-5 w-5" />
          New Protocol
        </Button>
      </div>

      <div className="flex items-center justify-between bg-card p-6 rounded-[2rem] border-none shadow-sm">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search disease protocols..." 
                className="pl-9 h-11 w-[300px] bg-muted/50 border-none rounded-xl font-medium" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mr-2">{templates.length} total definitions</span>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
         </div>
      </div>

      <div className="bg-transparent min-h-[400px]">
        {isLoading ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground font-medium">Loading protocol library...</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {filteredTemplates.map((template: DiseaseTemplate) => (
              <Card key={template.id} className="rounded-[2.5rem] border-none shadow-xl shadow-muted/20 overflow-hidden bg-card hover:shadow-muted/40 transition-all group">
                <CardHeader className="bg-muted/5 border-b pb-6 px-8 pt-8">
                  <div className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-black text-slate-800">{template.name}</CardTitle>
                        <CardDescription className="font-medium text-sm line-clamp-2">{template.description}</CardDescription>
                    </div>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                        onClick={() => handleDelete(template.id)}
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Activity className="h-3 w-3 text-info" />
                        Clinical Telemetry Frequency
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {template.metrics.map((m, idx: number) => (
                        <Badge key={idx} variant="outline" className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider border-info/20 bg-info/5 text-info">
                          {m.name} (T-{m.frequencyHours}h)
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Pill className="h-3 w-3 text-success" />
                        Pharmacological Schedule
                    </h4>
                    <div className="grid gap-3">
                      {template.medications.map((m, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-muted/30 border-none group-hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{m.name}</span>
                            <span className="text-[10px] font-black text-success uppercase tracking-tighter">{m.dose}</span>
                          </div>
                          <Badge className="bg-success/10 text-success border-none text-[10px] font-black">INTERVAL: {m.frequencyHours}H</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full rounded-2xl h-12 bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform">
                    Edit Protocol Logic
                  </Button>
                </CardContent>
              </Card>
            ))}
            {templates.length === 0 && (
              <div className="col-span-2 text-center py-24 text-muted-foreground italic font-medium bg-muted/20 border-2 border-dashed rounded-[3rem]">
                The protocol library is currently empty.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
