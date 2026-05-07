"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserCheck, Trash2, ShieldAlert, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/schemas";

interface UserManagementListProps {
  users: User[];
  onUpdateUser: (id: string, data: Partial<User>) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export function UserManagementList({ users, onUpdateUser, onDeleteUser }: UserManagementListProps) {
  
  const handleApprove = async (id: string) => {
    try {
      await onUpdateUser(id, { accountStatus: "active" });
      toast.success("User approved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await onUpdateUser(id, { role: role as User["role"] });
      toast.success("User role updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  const handleToggleActive = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "deactivated" : "active";
    try {
      await onUpdateUser(id, { accountStatus: newStatus });
      toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      try {
        await onDeleteUser(id);
        toast.success("User deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete user");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest w-[300px]">Identity</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Clinical Role</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Verification</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Access Toggle</TableHead>
            <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest">Management</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/10 transition-colors border-b last:border-0">
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/5 shadow-sm">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
                        {user.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-base leading-none mb-1">{user.fullName || "Unnamed Staff"}</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">@{user.username}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Select 
                  value={user.role} 
                  onValueChange={(val) => handleRoleChange(user.id!, val)}
                >
                  <SelectTrigger className="h-9 w-36 rounded-xl text-xs font-bold border-none bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                        <UserCog className="h-3 w-3 text-primary" />
                        <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="patient" className="rounded-lg font-medium">Patient</SelectItem>
                    <SelectItem value="doctor" className="rounded-lg font-medium">Doctor</SelectItem>
                    <SelectItem value="nurse" className="rounded-lg font-medium">Nurse</SelectItem>
                    <SelectItem value="pharmacist" className="rounded-lg font-medium">Pharmacist</SelectItem>
                    <SelectItem value="admin" className="rounded-lg font-medium font-black text-primary">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {user.accountStatus === "inactive" ? (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning animate-pulse gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <ShieldAlert className="h-3 w-3" />
                    Pending Approval
                  </Badge>
                ) : (
                  <Badge 
                    variant={user.accountStatus === "active" ? "default" : "destructive"} 
                    className={`capitalize rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider ${user.accountStatus === 'active' ? 'bg-success/10 text-success hover:bg-success/20 border-success/20' : ''}`}
                  >
                    {user.accountStatus}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch 
                    disabled={user.accountStatus === "inactive"}
                    checked={user.accountStatus === "active"}
                    onCheckedChange={() => handleToggleActive(user.id!, user.accountStatus)}
                    className="data-[state=checked]:bg-success"
                  />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${user.accountStatus === "active" ? "text-success" : "text-muted-foreground"}`}>
                    {user.accountStatus === "active" ? "Live" : "Locked"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-8 text-right">
                <div className="flex justify-end gap-2">
                  {user.accountStatus === "inactive" && (
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="h-9 rounded-xl gap-2 font-bold px-4 shadow-lg shadow-primary/10"
                      onClick={() => handleApprove(user.id!)}
                    >
                      <UserCheck className="h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-all hover:scale-110"
                    onClick={() => handleDelete(user.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                No clinical personnel found in the directory.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
