"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { 
  Users, 
  BedDouble, 
  Receipt,
  TrendingUp,
  Activity,
  ArrowUpRight,
  PlusCircle,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Bed } from "@/lib/schemas";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

export default function AdminDashboard() {
  const { 
    users, 
    beds,
    billing,
    fetchUsers, 
    fetchBeds,
    fetchBilling
  } = useAdmin();

  useEffect(() => {
    fetchUsers();
    fetchBeds();
    fetchBilling();
  }, [fetchUsers, fetchBeds, fetchBilling]);

  const activeUsers = users.filter(u => u.accountStatus === "active").length;
  const occupiedBeds = beds.filter(b => b.isOccupied).length;
  const occupancyRate = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;
  const totalRevenue = billing.reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Clinical Overview</h1>
          <p className="text-muted-foreground font-medium">System performance and facility health metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-2 font-bold h-11">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20 h-11 font-bold">
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Staff Directory</CardTitle>
            <div className="p-2 bg-info/10 rounded-lg text-info">
                <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-success font-bold">{activeUsers}</span> active clinical staff
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bed Occupancy</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <BedDouble className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{occupancyRate}%</div>
            <div className="mt-3">
                <Progress value={occupancyRate} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {occupiedBeds} of {beds.length} units currently in use
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Revenue Flow</CardTitle>
            <div className="p-2 bg-success/10 rounded-lg text-success">
                <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success font-bold">+8.2%</span> from previous cycle
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Activity className="h-32 w-32" />
            </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">System Status</CardTitle>
            <Activity className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Stable</div>
            <p className="text-xs mt-1 opacity-70">All clinical nodes operational</p>
            <Button variant="secondary" size="sm" className="mt-4 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 border-none text-primary-foreground text-[10px] h-7">
                Diagnostics
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[2rem] border-none shadow-sm bg-card h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-xl font-bold">Staff Onboarding</CardTitle>
                <CardDescription>Recently registered medical personnel.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl"><ArrowUpRight className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {users.slice(0, 5).map((user: User) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                      {user.username?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.fullName || user.username}</p>
                      <p className="text-xs text-muted-foreground uppercase font-medium">{user.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {user.accountStatus}
                  </Badge>
                </div>
              ))}
              {users.length === 0 && <p className="text-center py-6 text-muted-foreground italic text-sm">No recent staff activity.</p>}
            </div>
            <Button className="w-full mt-6 rounded-xl bg-muted/50 text-foreground hover:bg-muted border-none font-bold">
                View All Personnel
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-card h-full">
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle className="text-xl font-bold">Facility Status</CardTitle>
                <CardDescription>Live room and bed allocation monitoring.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl"><PlusCircle className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent>
             <div className="rounded-xl border border-muted/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="text-[10px] font-black uppercase">Room</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Occupant</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {beds.slice(0, 5).map((bed: Bed & { currentPatientName?: string }) => (
                            <TableRow key={bed.id} className="hover:bg-muted/20 transition-colors">
                                <TableCell className="font-bold py-3">#{bed.roomNumber}</TableCell>
                                <TableCell className="py-3">
                                    <div className={`h-2 w-2 rounded-full ${bed.isOccupied ? 'bg-destructive' : 'bg-success'}`} />
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground py-3">
                                    {bed.isOccupied ? (bed.currentPatientName || "Anonymous Patient") : "Vacant"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
             <Button className="w-full mt-6 rounded-xl bg-muted/50 text-foreground hover:bg-muted border-none font-bold">
                Manage Facility
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
