import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const vitalsSchema = z.object({
  patientId: z.string().min(1, "Required"),
  temperature: z.coerce.number().min(30).max(45),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80"),
  heartRate: z.coerce.number().int().min(30).max(250),
  spO2: z.coerce.number().int().min(0).max(100),
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

interface VitalsFormProps {
  patientId: string;
  onSubmit: (data: VitalsFormValues) => void;
  isLoading: boolean;
}

export function VitalsForm({ patientId, onSubmit, isLoading }: VitalsFormProps) {
  const form = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema) as unknown as Resolver<VitalsFormValues>,
    defaultValues: {
      patientId,
      temperature: 36.6,
      bloodPressure: "120/80",
      heartRate: 70,
      spO2: 98,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...form.register("patientId")} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="temperature">Temp (°C)</Label>
          <Controller
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <Input id="temperature" type="number" step="0.1" {...field} />
            )}
          />
          {form.formState.errors.temperature && (
            <p className="text-sm text-destructive">
              {form.formState.errors.temperature.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="bloodPressure">Blood Pressure</Label>
          <Controller
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
              <Input id="bloodPressure" placeholder="120/80" {...field} />
            )}
          />
          {form.formState.errors.bloodPressure && (
            <p className="text-sm text-destructive">
              {form.formState.errors.bloodPressure.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
          <Controller
            control={form.control}
            name="heartRate"
            render={({ field }) => (
              <Input id="heartRate" type="number" {...field} />
            )}
          />
          {form.formState.errors.heartRate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.heartRate.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="spO2">SpO2 (%)</Label>
          <Controller
            control={form.control}
            name="spO2"
            render={({ field }) => (
              <Input id="spO2" type="number" {...field} />
            )}
          />
          {form.formState.errors.spO2 && (
            <p className="text-sm text-destructive">
              {form.formState.errors.spO2.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Log Vitals"}
      </Button>
    </form>
  );
}
