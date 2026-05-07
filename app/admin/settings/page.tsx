"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
    Settings as SettingsIcon, 
    User, 
    Briefcase, 
    ShieldCheck,
    Hospital,
    Globe,
    Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <SettingsIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">Manage hospital configuration, security policies, and your profile.</p>
          </div>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary font-bold uppercase">
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-12">
          <TabsTrigger value="profile" className="rounded-lg px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">Profile</TabsTrigger>
          <TabsTrigger value="hospital" className="rounded-lg px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">Hospital Config</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 outline-none">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 rounded-2xl border-none shadow-sm bg-card overflow-hidden">
              <CardHeader className="border-b pb-6">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Administrator Profile
                </CardTitle>
                <CardDescription>Your personal information and credentials.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold uppercase text-muted-foreground">Full Name</Label>
                    <Input id="fullName" defaultValue={user?.fullName || ""} className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">Email Address</Label>
                    <Input id="email" defaultValue={user?.email || ""} className="rounded-xl h-11 bg-muted/30 border-none" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-bold uppercase text-muted-foreground">Username</Label>
                    <Input id="username" defaultValue={user?.username || ""} className="rounded-xl h-11 bg-muted/30 border-none" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase text-muted-foreground">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 000-0000" className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20">Save Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-3xl font-bold">
                  {(user?.fullName || user?.username)?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.fullName || user?.username}</h3>
                  <p className="text-sm opacity-80">@{user?.username}</p>
                </div>
                <Badge className="bg-white/20 text-white border-none px-4 py-1 uppercase tracking-wider text-[10px] font-black">
                  {user?.role}
                </Badge>
                <div className="w-full pt-6 space-y-3">
                   <div className="flex justify-between text-xs border-t border-white/10 pt-3">
                      <span className="opacity-70">Account Status</span>
                      <span className="font-bold text-success uppercase">Active</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="opacity-70">Last Login</span>
                      <span className="font-bold">Today, 09:42 AM</span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hospital" className="outline-none">
          <Card className="rounded-2xl border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="border-b pb-6">
              <CardTitle className="flex items-center gap-2">
                <Hospital className="h-5 w-5 text-primary" />
                Hospital Configuration
              </CardTitle>
              <CardDescription>Global settings for the healthcare facility.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h3 className="font-bold flex items-center gap-2"><Globe className="h-4 w-4" /> Localization</h3>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Hospital Name</Label>
                        <Input defaultValue="Central General Hospital" className="rounded-xl h-11 bg-muted/30 border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Default Currency</Label>
                        <Input defaultValue="USD ($)" className="rounded-xl h-11 bg-muted/30 border-none" />
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h3 className="font-bold flex items-center gap-2"><Briefcase className="h-4 w-4" /> Operational Hours</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Opening Time</Label>
                        <Input type="time" defaultValue="00:00" className="rounded-xl h-11 bg-muted/30 border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Closing Time</Label>
                        <Input type="time" defaultValue="23:59" className="rounded-xl h-11 bg-muted/30 border-none" />
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Emergency 24/7</p>
                        <p className="text-xs text-muted-foreground">Allow admissions outside normal hours.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20">Apply Global Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="outline-none">
          <Card className="rounded-2xl border-none shadow-sm bg-card overflow-hidden">
             <CardHeader className="border-b pb-6">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Security & Access Control
                </CardTitle>
                <CardDescription>Manage password policies and system access.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Require an additional code to sign in.</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Strict Password Policy</p>
                        <p className="text-xs text-muted-foreground">Enforce complex passwords for all staff.</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Automatic Session Timeout</p>
                        <p className="text-xs text-muted-foreground">Log out users after 30 minutes of inactivity.</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
