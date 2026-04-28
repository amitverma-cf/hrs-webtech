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

interface UserManagementListProps {
  users: any[];
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export function UserManagementList({ users, onToggleStatus }: UserManagementListProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Access</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.accountStatus === "active" ? "default" : "destructive"}>
                  {user.accountStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {user.accountStatus === "active" ? "Enabled" : "Disabled"}
                  </span>
                  <Switch 
                    checked={user.accountStatus === "active"}
                    onCheckedChange={() => onToggleStatus(user.id, user.accountStatus)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
