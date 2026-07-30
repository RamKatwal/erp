"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { AppNavbar } from "@/components/layout/app-navbar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { KeyboardShortcutsDialog } from "@/components/layout/keyboard-shortcuts-dialog"
import { KeyboardShortcutsProvider } from "@/components/layout/keyboard-shortcuts-provider"
import { SettingsModal } from "@/components/settings/settings-modal"
import { SettingsModalProvider } from "@/components/settings/settings-modal-provider"
import {
  HomeViewProvider,
  useHomeView,
} from "@/components/dashboard/home/home-view-context"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type DashboardShellProps = {
  children: React.ReactNode
}

function DashboardShellContent({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const { isFullscreen, exitFullscreen } = useHomeView()

  React.useEffect(() => {
    if (pathname !== "/" && isFullscreen) {
      exitFullscreen()
    }
  }, [pathname, isFullscreen, exitFullscreen])

  return (
    <SidebarProvider
      className={cn("h-svh overflow-hidden", isFullscreen && "relative")}
    >
      {!isFullscreen ? <AppSidebar /> : null}
      <SidebarInset
        className={cn(
          "h-svh overflow-y-auto",
          isFullscreen && "min-w-0 flex-1"
        )}
      >
        {!isFullscreen ? <AppNavbar /> : null}
        <div
          className={cn(
            "flex flex-1 flex-col gap-3 px-3 py-3 md:px-4 md:py-4",
            isFullscreen && "px-4 py-4 md:px-6 md:py-5"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <HomeViewProvider>
      <KeyboardShortcutsProvider>
        <SettingsModalProvider>
          <DashboardShellContent>{children}</DashboardShellContent>
          <KeyboardShortcutsDialog />
          <SettingsModal />
        </SettingsModalProvider>
      </KeyboardShortcutsProvider>
    </HomeViewProvider>
  )
}
