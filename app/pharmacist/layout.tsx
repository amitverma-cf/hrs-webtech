import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function PharmacistLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="pharmacist">{children}</DashboardLayout>;
}
