"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // If we wanted to support other roles with different sidebars, we could pass a prop to AppSidebar
  // or have multiple Sidebar components. For now, focusing on Admin.

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col bg-background/50">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <div className="relative w-full max-w-md group-data-[collapsible=icon]:hidden md:flex hidden">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  placeholder="Search clinical data..." 
                  className="pl-10 h-10 w-full bg-muted/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main className="flex-1 relative overflow-x-hidden">
             {/* Subtle background texture */}
            <div 
              className="absolute inset-0 [background-size:24px_24px] pointer-events-none opacity-20" 
              style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)' }}
            />
            
            <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

