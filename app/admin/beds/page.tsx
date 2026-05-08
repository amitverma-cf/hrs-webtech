"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { DoorOpen, PlusCircle, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bed } from "@/lib/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminRoomsPage() {
  const { beds: rooms, wards, isLoading, fetchBeds, fetchWards, addBed, deleteBed } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newDailyRate, setNewDailyRate] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");

  useEffect(() => {
    fetchBeds();
    fetchWards();
  }, [fetchBeds, fetchWards]);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber || !newDailyRate || !selectedWardId) return;

    try {
      await addBed({
        roomNumber: newRoomNumber,
        dailyRate: Number(newDailyRate),
        wardId: selectedWardId,
        isOccupied: false
      });
      toast.success("Room added successfully");
      setIsDialogOpen(false);
      setNewRoomNumber("");
      setNewDailyRate("");
      setSelectedWardId("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add room");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this room?")) {
      try {
        await deleteBed(id);
        toast.success("Room removed");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to remove room");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl shadow-inner">
            <DoorOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Facility Inventory</h1>
            <p className="text-muted-foreground font-medium">Configuring clinical spaces and room allocations.</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 gap-2 font-bold">
              <PlusCircle className="h-5 w-5" />
              Initialize Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                <DoorOpen className="h-6 w-6 text-primary" />
                New Clinical Room
              </DialogTitle>
              <DialogDescription className="font-medium">Enter room details for the facility directory.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRoom} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="ward" className="text-[10px] font-black uppercase text-muted-foreground">Ward Allocation</Label>
                <Select value={selectedWardId} onValueChange={setSelectedWardId}>
                  <SelectTrigger id="ward" className="rounded-xl h-12 bg-muted/50 border-none font-bold">
                    <SelectValue placeholder="Select a ward..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    {wards.map((w) => (
                      <SelectItem key={w.id} value={w.id} className="rounded-lg">{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber" className="text-[10px] font-black uppercase text-muted-foreground">Room Designation</Label>
                <Input
                  id="roomNumber"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="e.g., Ward A-101"
                  className="rounded-xl h-12 bg-muted/50 border-none font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate" className="text-[10px] font-black uppercase text-muted-foreground">Daily Operational Rate ($)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={newDailyRate}
                  onChange={(e) => setNewDailyRate(e.target.value)}
                  placeholder="e.g., 250"
                  className="rounded-xl h-12 bg-muted/50 border-none font-bold"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl h-12 font-black">Register Space</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/30 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b bg-muted/5">
          <div>
            <CardTitle className="text-xl font-bold">Room Directory</CardTitle>
            <CardDescription className="font-medium text-xs uppercase tracking-widest mt-1">Status and utilization tracking</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative md:block hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filter rooms..." className="pl-9 h-10 w-[200px] bg-muted/50 border-none rounded-xl" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-2"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium">Syncing inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Designation</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Allocation Status</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Assigned Patient</TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Daily Rate</TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest">Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room: Bed & { currentPatientName?: string }) => (
                    <TableRow key={room.id} className="hover:bg-muted/10 transition-colors border-b last:border-0">
                      <TableCell className="px-8 py-6 font-black text-lg">#{room.roomNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={room.isOccupied ? "destructive" : "default"}
                          className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider ${!room.isOccupied ? 'bg-success/10 text-success hover:bg-success/20 border-success/20' : ''}`}
                        >
                          {room.isOccupied ? "Occupied" : "Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-muted-foreground">
                        {room.currentPatientName || (room.currentPatientId ? `PAT-${room.currentPatientId.substring(0, 6)}` : "—")}
                      </TableCell>
                      <TableCell className="font-black text-foreground/80">${room.dailyRate}</TableCell>
                      <TableCell className="px-8 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 transition-all hover:scale-110"
                          onClick={() => handleDelete(room.id)}
                          disabled={room.isOccupied}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rooms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-medium">
                        No clinical spaces configured.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
