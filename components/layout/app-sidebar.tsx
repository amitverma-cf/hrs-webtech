"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  BedDouble,
  Receipt,
  Settings,
  LogOut,
  Hospital,
  Stethoscope,
  Activity,
  ClipboardList,
  Pill,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const roleNavigation: Record<string, NavItem[]> = {
  admin: [
    { title: "Home", url: "/admin", icon: Home },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Rooms", url: "/admin/beds", icon: BedDouble },
    { title: "Billings", url: "/admin/billing", icon: Receipt },
  ],
  doctor: [
    { title: "Overview", url: "/doctor", icon: Home },
    { title: "Patients", url: "/doctor/patients", icon: Users },
    { title: "Prescriptions", url: "/doctor/prescriptions", icon: Stethoscope },
  ],
  nurse: [
    { title: "Task Queue", url: "/nurse", icon: Activity },
    { title: "Vitals", url: "/nurse/vitals", icon: Activity },
    { title: "Timeline", url: "/nurse/timeline", icon: ClipboardList },
  ],
  pharmacist: [
    { title: "Fulfillment", url: "/pharmacist", icon: Pill },
    { title: "Manifests", url: "/pharmacist/queue", icon: ClipboardList },
  ],
  patient: [
    { title: "My Health", url: "/patient", icon: UserCircle },
    { title: "Vitals", url: "/patient/vitals", icon: Activity },
    { title: "Prescriptions", url: "/patient/prescriptions", icon: Pill },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role = user?.role || "patient";
  const navItems = roleNavigation[role] || roleNavigation.patient;

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="border-b flex items-center px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hospital className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-lg tracking-tight">HRS {role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu className="px-3 group-data-[collapsible=icon]:p-2 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.url || (item.url !== `/${role}` && pathname.startsWith(item.url));
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="h-11 rounded-xl"
                >
                  <Link href={item.url}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t group-data-[collapsible=icon]:p-2 p-4 gap-4">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"}
              tooltip="Settings"
              className="h-11 rounded-xl"
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              tooltip="Logout"
              className="h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold truncate">{user?.fullName || user?.username || "Staff User"}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

