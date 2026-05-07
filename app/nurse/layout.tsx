import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
