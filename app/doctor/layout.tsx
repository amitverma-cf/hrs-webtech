import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="doctor">{children}</DashboardLayout>;
}
