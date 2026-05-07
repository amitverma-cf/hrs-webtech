"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Receipt, TrendingUp, Download, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminBillingPage() {
  const { billing, isLoading, fetchBilling } = useAdmin();

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const totalRevenue = billing.reduce((sum, b) => sum + (b.total || 0), 0);
  const pendingAmount = billing
    .filter(b => b.status === "pending")
    .reduce((sum, b) => sum + (b.total || 0), 0);
  const paidInvoices = billing.filter(b => b.status === "paid").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Receipt className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revenue & Billing</h1>
            <p className="text-muted-foreground">Monitor hospital financial records and patient invoices.</p>
          </div>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm border-none bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs mt-1 opacity-70">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm border-none bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{billing.filter(b => b.status === "pending").length} invoices awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-none bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {billing.length > 0 ? Math.round((paidInvoices / billing.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">{paidInvoices} of {billing.length} invoices settled</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm border-none bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-xl font-bold">Recent Invoices</CardTitle>
            <CardDescription>A detailed list of all patient transactions.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search invoice..." className="pl-9 h-10 w-[250px] bg-muted/50 border-none rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading financial data...</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {billing.map((invoice: any) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs uppercase">{invoice.id?.substring(0, 8) || 'NEW'}</TableCell>
                      <TableCell className="font-medium">{invoice.patientName || "Unknown Patient"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "Pending"}
                      </TableCell>
                      <TableCell className="font-semibold">${invoice.total?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={invoice.status === "paid" ? "default" : "secondary"}
                          className={invoice.status === "paid" ? "bg-success/10 text-success hover:bg-success/20 border-success/20" : ""}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="rounded-lg">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {billing.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                        No billing records found.
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
