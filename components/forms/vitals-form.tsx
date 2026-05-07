"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Thermometer, HeartPulse, Droplets, CheckCircle2 } from "lucide-react";

const vitalsSchema = z.object({
  patientId: z.string().min(1, "Required"),
  temperature: z.number().min(30).max(45),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80"),
  heartRate: z.number().int().min(30).max(250),
  spO2: z.number().int().min(0).max(100),
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

interface VitalsFormProps {
  patientId: string;
  onSubmit: (data: VitalsFormValues) => void;
  isLoading: boolean;
}

export function VitalsForm({ patientId, onSubmit, isLoading }: VitalsFormProps) {
  const { 
    control, 
    handleSubmit, 
    register,
    formState: { errors } 
  } = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      patientId,
      temperature: 36.6,
      bloodPressure: "120/80",
      heartRate: 70,
      spO2: 98,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("patientId")} />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="temperature" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
            <Thermometer className="h-3 w-3 text-orange-600" /> Core Temp (°C)
          </Label>
          <Controller
            control={control}
            name="temperature"
            render={({ field }) => (
              <Input 
                id="temperature" 
                type="number" 
                step="0.1" 
                {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="rounded-2xl h-12 bg-muted/50 border-none font-bold" 
              />
            )}
          />
          {errors.temperature && (
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.temperature.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodPressure" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary" /> Blood Pressure
          </Label>
          <Controller
            control={control}
            name="bloodPressure"
            render={({ field }) => (
              <Input id="bloodPressure" placeholder="120/80" {...field} className="rounded-2xl h-12 bg-muted/50 border-none font-bold" />
            )}
          />
          {errors.bloodPressure && (
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.bloodPressure.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="heartRate" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
            <HeartPulse className="h-3 w-3 text-rose-600" /> Heart Rate (BPM)
          </Label>
          <Controller
            control={control}
            name="heartRate"
            render={({ field }) => (
              <Input 
                id="heartRate" 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                className="rounded-2xl h-12 bg-muted/50 border-none font-bold" 
              />
            )}
          />
          {errors.heartRate && (
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.heartRate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="spO2" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
            <Droplets className="h-3 w-3 text-info" /> SpO2 (%)
          </Label>
          <Controller
            control={control}
            name="spO2"
            render={({ field }) => (
              <Input 
                id="spO2" 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                className="rounded-2xl h-12 bg-muted/50 border-none font-bold" 
              />
            )}
          />
          {errors.spO2 && (
            <p className="text-[10px] font-bold text-destructive uppercase">
              {errors.spO2.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full rounded-2xl h-14 text-xl font-black shadow-2xl shadow-primary/20 gap-3" disabled={isLoading}>
        {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
            <>
                <CheckCircle2 className="h-6 w-6" />
                Commit to Record
            </>
        )}
      </Button>
    </form>
  );
}
