"use client";

import React, { use } from "react";
import { usePatientChart } from "@/hooks/use-patient-chart";
import { PrintLayout } from "@/components/layout/print-layout";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function DischargeSummary({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { patient, timelineEvents, isLoading } = usePatientChart(id);


  if (isLoading) return <div className="p-20 text-center">Preparing clinical summary...</div>;

  return (
    <PrintLayout title="Official Discharge Summary & Final Bill">
      <section className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-1">
          <p className="font-bold uppercase text-xs text-muted-foreground">Patient Information</p>
          <p className="text-lg font-bold">{patient?.fullName}</p>
          <p>DOB: {patient?.dateOfBirth}</p>
          <p>Gender: {patient?.gender}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="font-bold uppercase text-xs text-muted-foreground">Facility Information</p>
          <p className="font-bold text-primary">Central General Hospital</p>
          <p>Discharge Ref: {id.split('-')[0].toUpperCase()}</p>
        </div>
      </section>

      <Separator className="my-6" />

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
            Clinical Observations
          </h3>
          <div className="rounded-xl border p-4 space-y-4 bg-muted/5 shadow-sm">
            {timelineEvents.filter(e => e.type === "note").map(note => (
              <div key={note.id} className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span>{new Date(note.date).toLocaleDateString()}</span>
                  <span>Dr. {note.metadata?.Doctor}</span>
                </div>
                <p className="text-sm font-medium">{note.description}</p>
                <Separator className="mt-2 opacity-50" />
              </div>
            ))}
            {timelineEvents.filter(e => e.type === "note").length === 0 && (
              <p className="text-sm text-muted-foreground">No clinical notes recorded during stay.</p>
            )}
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wide mt-8">Recent Vitals</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            {timelineEvents.filter(e => e.type === "vital").slice(0, 1).map(v => (
              <React.Fragment key={v.id}>
                <div className="bg-muted/30 p-2 rounded-lg"><p className="text-[9px] uppercase">Temp</p><p className="font-bold text-xs">{v.description.split(",")[0]?.split(":")[1] || "—"}</p></div>
                <div className="bg-muted/30 p-2 rounded-lg"><p className="text-[9px] uppercase">BP</p><p className="font-bold text-xs">{v.description.split(",")[1]?.split(":")[1] || "—"}</p></div>
                <div className="bg-muted/30 p-2 rounded-lg"><p className="text-[9px] uppercase">SpO2</p><p className="font-bold text-xs">{v.metadata.SpO2 || "—"}</p></div>
                <div className="bg-muted/30 p-2 rounded-lg"><p className="text-[9px] uppercase">HR</p><p className="font-bold text-xs">{v.metadata.HR || "—"}</p></div>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-primary">Final Itemized Statement</h3>
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[10px]">Description</TableHead>
                  <TableHead className="text-right text-[10px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs font-semibold">Base Admission Fee</TableCell>
                  <TableCell className="text-right text-xs">$100.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs">Inpatient Care (Daily Rate)</TableCell>
                  <TableCell className="text-right text-xs">$150.00</TableCell>
                </TableRow>
                <TableRow className="bg-primary/5">
                  <TableCell className="text-sm font-bold">Total Payable</TableCell>
                  <TableCell className="text-right text-sm font-bold text-primary">$250.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="text-[10px] text-muted-foreground px-2">
            * This is a generated summary. Official invoices are issued by the hospital finance department.
          </p>
        </section>
      </div>

      <section className="mt-24 flex justify-between items-end px-4">
        <div className="w-48 border-t border-black pt-2 text-center">
          <p className="text-[10px] font-bold uppercase">Patient/Guardian Signature</p>
        </div>
        <div className="w-48 border-t border-black pt-2 text-center">
          <p className="text-[10px] font-bold uppercase">Authorized Medical Officer</p>
        </div>
      </section>
    </PrintLayout>
  );
}
