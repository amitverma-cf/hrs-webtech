"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CheckCircle2, User, Calendar, Phone } from "lucide-react";

const patientSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  contactInfo: z.string().min(5, "Contact info is required"),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormValues) => void;
  isLoading: boolean;
}

export function PatientRegistrationForm({ onSubmit, isLoading }: PatientRegistrationFormProps) {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: "male"
    }
  });

  const genderValue = useWatch({ control, name: "gender" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Legal Name</Label>
        <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="fullName" {...register("fullName")} placeholder="John Doe" className="pl-10 rounded-2xl h-12 bg-muted/50 border-none font-bold" />
        </div>
        {errors.fullName && <p className="text-[10px] font-bold text-destructive uppercase animate-pulse">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Date of Birth</Label>
          <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="pl-10 rounded-2xl h-12 bg-muted/50 border-none font-bold" />
          </div>
          {errors.dateOfBirth && <p className="text-[10px] font-bold text-destructive uppercase animate-pulse">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Biological Gender</Label>
          <Select value={genderValue} onValueChange={(val: "male" | "female" | "other") => setValue("gender", val)}>
            <SelectTrigger className="rounded-2xl h-12 bg-muted/50 border-none font-black">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="male" className="rounded-xl font-bold py-3">Male Identity</SelectItem>
              <SelectItem value="female" className="rounded-xl font-bold py-3">Female Identity</SelectItem>
              <SelectItem value="other" className="rounded-xl font-bold py-3">Other / Intersex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactInfo" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Primary Contact (Secure)</Label>
        <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="contactInfo" {...register("contactInfo")} placeholder="+1 234 567 890" className="pl-10 rounded-2xl h-12 bg-muted/50 border-none font-bold" />
        </div>
        {errors.contactInfo && <p className="text-[10px] font-bold text-destructive uppercase animate-pulse">{errors.contactInfo.message}</p>}
      </div>

      <Button type="submit" className="w-full rounded-2xl h-14 text-xl font-black shadow-2xl shadow-primary/20 gap-3" disabled={isLoading}>
        {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
            <>
                <CheckCircle2 className="h-6 w-6" />
                Finalize Registry
            </>
        )}
      </Button>
    </form>
  );
}
