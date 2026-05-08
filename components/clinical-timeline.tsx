import { Activity, Pill, FileText, Clock } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "vital" | "prescription" | "note";
  date: string;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
}

interface ClinicalTimelineProps {
  events: TimelineEvent[];
}

export function ClinicalTimeline({ events }: ClinicalTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "vital": return <Activity className="h-4 w-4 text-info" />;
      case "prescription": return <Pill className="h-4 w-4 text-success" />;
      case "note": return <FileText className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4">
          {/* Vertical Line */}
          {index !== events.length - 1 && (
            <div className="absolute left-[19px] top-8 h-[calc(100%+32px)] w-[2px] bg-muted" />
          )}

          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
            {getIcon(event.type)}
          </div>

          <div className="flex flex-col gap-1 pt-1 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{event.title}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
            {event.metadata && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(event.metadata).map(([key, value]) => (
                  <span key={key} className="text-[10px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No clinical history recorded for this patient.</p>
        </div>
      )}
    </div>
  );
}
