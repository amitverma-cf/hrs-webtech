"use client";

import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading settings...</div>;
  }

  if (!user) {
    return null; // Proxy will redirect to login
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
