"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut,
  Home,
  Activity,
  Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
}

const roleIcons: Record<string, any[]> = {
  admin: [
    { icon: Home, href: "/admin", label: "Dashboard" },
    { icon: Users, href: "/admin/users", label: "User Management" },
    { icon: ClipboardList, href: "/admin/audit", label: "Audit Logs" },
  ],
  doctor: [
    { icon: Home, href: "/doctor", label: "Dashboard" },
    { icon: Users, href: "/doctor/patients", label: "Patients" },
    { icon: ClipboardList, href: "/doctor/prescriptions", label: "Prescriptions" },
  ],
  nurse: [
    { icon: Home, href: "/nurse", label: "Dashboard" },
    { icon: Activity, href: "/nurse/vitals", label: "Vitals Entry" },
    { icon: ClipboardList, href: "/nurse/timeline", label: "Patient Timeline" },
  ],
  pharmacist: [
    { icon: Home, href: "/pharmacist", label: "Dashboard" },
    { icon: Pill, href: "/pharmacist/queue", label: "Prescription Queue" },
  ],
  patient: [
    { icon: Home, href: "/patient", label: "My Health" },
    { icon: ClipboardList, href: "/patient/prescriptions", label: "Prescriptions" },
    { icon: Activity, href: "/patient/vitals", label: "Vitals History" },
  ],
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const icons = roleIcons[role] || [];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Icon Sidebar */}
      <aside className="flex w-20 flex-col items-center border-r bg-muted/30 py-6 space-y-8 z-20">
        <div className="flex flex-col items-center gap-6 flex-1">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg">
            H
          </div>
          <nav className="flex flex-col gap-4">
            {icons.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className="h-12 w-12 rounded-xl transition-all hover:scale-105"
                    title={item.label}
                  >
                    <Icon className="h-6 w-6" />
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl" title="Settings">
            <Settings className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10" 
            title="Logout"
            onClick={() => logout()}
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Subtle background texture/gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
        
        <main className="flex-1 overflow-auto p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
