"use client"

import * as React from "react"

import type { DashboardWidgetId } from "@/lib/dashboard/default-layout"

type DashboardLayoutContextValue = {
  isLayoutEditing: boolean
  removeWidget: (widgetId: DashboardWidgetId) => void
}

const DashboardLayoutContext =
  React.createContext<DashboardLayoutContextValue | null>(null)

export function DashboardLayoutProvider({
  isLayoutEditing,
  removeWidget,
  children,
}: {
  isLayoutEditing: boolean
  removeWidget: (widgetId: DashboardWidgetId) => void
  children: React.ReactNode
}) {
  const value = React.useMemo(
    () => ({ isLayoutEditing, removeWidget }),
    [isLayoutEditing, removeWidget]
  )

  return (
    <DashboardLayoutContext.Provider value={value}>
      {children}
    </DashboardLayoutContext.Provider>
  )
}

export function useDashboardLayoutEdit() {
  const context = React.useContext(DashboardLayoutContext)
  if (!context) {
    throw new Error(
      "useDashboardLayoutEdit must be used within DashboardLayoutProvider"
    )
  }
  return context
}
