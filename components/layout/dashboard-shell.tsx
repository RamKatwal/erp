"use client"

import { AppNavbar } from "@/components/layout/app-navbar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type DashboardShellProps = {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="h-svh overflow-y-auto">
        <AppNavbar />
        <div className="flex flex-1 flex-col gap-3 px-3 py-3 md:px-4 md:py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
