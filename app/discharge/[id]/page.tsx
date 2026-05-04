"use client";

import React, { use } from "react";
import { usePatientChart } from "@/hooks/use-patient-chart";
import { PrintLayout } from "@/components/layout/print-layout";
import { Separator } from "@/components/ui/separator";

export default function DischargeSummary({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { patient, timelineEvents, isLoading } = usePatientChart(id);

  if (isLoading) return <div className="p-20 text-center">Preparing clinical summary...</div>;

  return (
    <PrintLayout title="Discharge Summary">
      <section className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-1">
          <p className="font-bold uppercase text-xs text-muted-foreground">Patient Information</p>
          <p className="text-lg font-bold">{patient?.fullName}</p>
          <p>DOB: {patient?.dateOfBirth}</p>
          <p>Gender: {patient?.gender}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="font-bold uppercase text-xs text-muted-foreground">Facility Information</p>
          <p className="font-bold text-primary">HRS General Hospital</p>
          <p>Clinical Dept: Internal Medicine</p>
        </div>
      </section>

      <Separator className="my-6" />

      <section className="space-y-4">
        <h3 className="text-md font-bold uppercase tracking-wide">Clinical Observations</h3>
        <div className="rounded-lg border p-4 space-y-4 bg-muted/10">
          {timelineEvents.filter(e => e.type === "note").map(note => (
            <div key={note.id} className="space-y-1">
              <div className="flex justify-between items-center italic text-[10px]">
                <span>{new Date(note.date).toLocaleDateString()}</span>
                <span>Dr. {note.metadata?.Doctor}</span>
              </div>
              <p className="text-sm">{note.description}</p>
              <Separator className="mt-2 opacity-50" />
            </div>
          ))}
          {timelineEvents.filter(e => e.type === "note").length === 0 && (
            <p className="text-sm text-muted-foreground italic">No clinical notes recorded.</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-md font-bold uppercase tracking-wide">Final Vitals (Pre-Discharge)</h3>
        <div className="grid grid-cols-4 gap-4 border p-4 rounded-lg">
          {timelineEvents.filter(e => e.type === "vital").slice(0, 1).map(v => (
             <React.Fragment key={v.id}>
               <div className="text-center"><p className="text-[10px] uppercase">Temp</p><p className="font-bold">{v.description.split(",")[0]?.split(":")[1] || "N/A"}</p></div>
               <div className="text-center"><p className="text-[10px] uppercase">BP</p><p className="font-bold">{v.description.split(",")[1]?.split(":")[1] || "N/A"}</p></div>
               <div className="text-center"><p className="text-[10px] uppercase">SpO2</p><p className="font-bold">{v.metadata.SpO2 || "N/A"}</p></div>
               <div className="text-center"><p className="text-[10px] uppercase">HR</p><p className="font-bold">{v.metadata.HR || "N/A"}</p></div>
             </React.Fragment>
          ))}
          {timelineEvents.filter(e => e.type === "vital").length === 0 && (
            <div className="col-span-4 text-center text-sm text-muted-foreground italic">No vital logs available.</div>
          )}
        </div>
      </section>

      <section className="mt-20 flex justify-end">
        <div className="w-64 border-t-2 border-black pt-2 text-center">
          <p className="text-xs font-bold uppercase">Attending Physician Signature</p>
        </div>
      </section>
    </PrintLayout>
  );
}
