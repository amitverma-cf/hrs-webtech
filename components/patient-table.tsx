import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, LayoutDashboard, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Patient } from "@/lib/schemas";

interface PatientTableProps {
  patients: Patient[];
  onViewDetails: (id: string) => void;
  onAdmit?: (patient: Patient) => void;
}

export function PatientTable({ patients, onViewDetails, onAdmit }: PatientTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Clinical Identity</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Demographic</TableHead>
            <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest">Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-muted/10 transition-colors border-b last:border-0 group">
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/5 shadow-sm">
                    <AvatarImage src={`https://avatar.vercel.sh/${patient.id}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
                      {patient.fullName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-base leading-none mb-1 text-foreground/80">{patient.fullName}</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">ID: {patient.id?.substring(0, 8).toUpperCase() || 'NEW'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <span className="text-sm font-bold capitalize text-foreground/70">{patient.gender}</span>
              </TableCell>
              <TableCell className="px-8 text-right">
                <div className="flex justify-end gap-2">
                  {onAdmit && (
                    <Button
                      variant="default"
                      size="sm"
                      className="rounded-xl h-10 px-4 font-black text-[10px] uppercase gap-2 shadow-lg shadow-primary/10"
                      onClick={() => onAdmit(patient)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Admit
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-10 px-4 font-black text-[10px] uppercase gap-2 border-2 hover:bg-muted"
                    onClick={() => onViewDetails(patient.id || "")}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Chart
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-muted"
                    onClick={() => onViewDetails(patient.id || "")}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {patients.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-24 text-muted-foreground font-medium">
                No patient records found in the directory.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
