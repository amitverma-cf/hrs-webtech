import { useParams, useNavigate } from "react-router-dom";
import { usePatientChart } from "../hooks/use-patient-chart";
import { useAuth } from "../hooks/use-auth";
import { ClinicalTimeline } from "../components/clinical-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Printer, User } from "lucide-react";

export function PatientChartView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patient, timelineEvents, isLoading } = usePatientChart(id!);
  const { user } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading clinical history...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Patient Chart</h1>
              <p className="text-xs text-muted-foreground">ID: {id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(`/print/discharge/${id}`, "_blank")}>
              <Printer className="mr-2 h-4 w-4" />
              Print Summary
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto py-8 px-4 grid gap-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</label>
                  <p className="text-sm font-semibold">{patient?.fullName}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Date of Birth</label>
                  <p className="text-sm">{patient?.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Gender</label>
                  <p className="text-sm capitalize">{patient?.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Clinical Life Stream
            </h2>
            <ClinicalTimeline events={timelineEvents} />
          </div>
        </section>
      </main>
    </div>
  );
}
