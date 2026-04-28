import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, XCircle } from "lucide-react";

interface PrescriptionQueueProps {
  prescriptions: any[];
  onAction: (id: string, status: "dispensed" | "rejected") => void;
}

export function PrescriptionQueue({ prescriptions, onAction }: PrescriptionQueueProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((px) => (
            <TableRow key={px.id}>
              <TableCell className="font-medium">{px.medicationName}</TableCell>
              <TableCell>{px.dosage}</TableCell>
              <TableCell>{px.frequency}</TableCell>
              <TableCell>{px.duration}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 hover:text-green-700"
                  onClick={() => onAction(px.id, "dispensed")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Dispense
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => onAction(px.id, "rejected")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {prescriptions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No pending prescriptions in the queue.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
