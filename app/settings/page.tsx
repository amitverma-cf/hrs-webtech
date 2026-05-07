"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
    Settings as SettingsIcon, 
    User, 
    Briefcase, 
    HeartPulse, 
    Calendar, 
    MapPin, 
    Phone, 
    ShieldCheck,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user } = useAuth();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile security synchronization successful.");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-3xl shadow-inner">
                <SettingsIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
                <h1 className="text-4xl font-black tracking-tight">Identity & Security</h1>
                <p className="text-muted-foreground font-medium italic">Validated Credentials for {user?.fullName || user?.username}</p>
            </div>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px]">
            Role: {user?.role}
        </Badge>
      </div>

      <form onSubmit={handleSave} className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Core Identity */}
        <div className="md:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden">
                <CardHeader className="bg-muted/5 border-b pb-6 px-8 pt-8">
                    <CardTitle className="flex items-center gap-3 text-2xl font-black">
                        <User className="h-6 w-6 text-primary" />
                        Personal Dossier
                    </CardTitle>
                    <CardDescription className="font-medium">Primary demographic and contact identifiers.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-[10px] font-black uppercase text-muted-foreground">Legal Name</Label>
                            <Input id="fullName" defaultValue={user?.fullName || ""} className="rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-[10px] font-black uppercase text-muted-foreground">Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="dob" type="date" className="pl-10 rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-[10px] font-black uppercase text-muted-foreground">Contact Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" placeholder="+1 (555) 000-0000" className="pl-10 rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-[10px] font-black uppercase text-muted-foreground">Residential Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="address" placeholder="123 Hospital St, Clinic City" className="pl-10 rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Role Specific Section */}
            {user?.role !== "patient" && (
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden">
                    <CardHeader className="bg-muted/5 border-b pb-6 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-2xl font-black">
                            <Briefcase className="h-6 w-6 text-primary" />
                            Clinical Credentials
                        </CardTitle>
                        <CardDescription className="font-medium">Departmental assignment and professional registration.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-[10px] font-black uppercase text-muted-foreground">Assigned Ward / Dept</Label>
                                <Input id="department" defaultValue={user?.department || ""} className="rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license" className="text-[10px] font-black uppercase text-muted-foreground">Medical License No.</Label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                    <Input id="license" placeholder="REG-88293-MD" className="pl-10 rounded-2xl h-12 bg-muted/30 border-none font-bold" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-[10px] font-black uppercase text-muted-foreground">Professional Summary</Label>
                            <textarea id="bio" className="w-full rounded-2xl p-4 bg-muted/30 border-none font-medium text-sm min-h-[120px] focus:ring-2 ring-primary/20 outline-none" placeholder="Brief professional biography for clinical reports..." />
                        </div>
                    </CardContent>
                </Card>
            )}

            {user?.role === "patient" && (
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden">
                    <CardHeader className="bg-destructive/5 border-b pb-6 px-8 pt-8">
                        <CardTitle className="flex items-center gap-3 text-2xl font-black text-destructive">
                            <HeartPulse className="h-6 w-6 text-destructive" />
                            Emergency & Critical Info
                        </CardTitle>
                        <CardDescription className="font-medium">Immediate identifiers for clinical safety.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ice_contact" className="text-[10px] font-black uppercase text-destructive">Next of Kin (Name)</Label>
                                <Input id="ice_contact" placeholder="Jane Doe" className="rounded-2xl h-12 bg-destructive/10 border-none font-bold text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ice_phone" className="text-[10px] font-black uppercase text-destructive">Emergency Phone</Label>
                                <Input id="ice_phone" placeholder="+1 (555) 911-0000" className="rounded-2xl h-12 bg-destructive/10 border-none font-bold text-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="allergies" className="text-[10px] font-black uppercase text-destructive">Primary Allergies</Label>
                            <Input id="allergies" placeholder="Penicillin, NSAIDs, Peanuts" className="rounded-2xl h-12 bg-destructive/10 border-none font-bold text-destructive" />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Right Column: Account & Meta */}
        <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-sidebar text-sidebar-foreground">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-black">System Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center py-6">
                        <div className="h-24 w-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center text-3xl font-black mb-4">
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <p className="font-bold text-lg">@{user?.username}</p>
                        <Badge className="mt-2 bg-muted text-foreground border-none font-bold">{user?.role}</Badge>
                    </div>
                    <Separator className="bg-sidebar-border" />
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground/60 font-bold uppercase tracking-wider">Status</span>
                            <span className="font-bold text-success uppercase tracking-widest">{user?.accountStatus}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground/60 font-bold uppercase tracking-wider">ID Reference</span>
                            <span className="font-mono text-[10px]">{user?.id?.split('-')[0].toUpperCase()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
                <CardHeader className="bg-muted/5 border-b">
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" /> Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-center">
                    <p className="text-xs text-muted-foreground font-medium italic">To update your credentials or biometric identity, please contact clinical operations.</p>
                    <Button type="submit" className="w-full rounded-2xl h-12 font-black shadow-lg shadow-primary/20">Sync Identity</Button>
                </CardContent>
            </Card>
        </div>
      </form>
    </div>
  );
}
