"use client"

import * as React from "react"

type DashboardLayoutContextValue = {
  isLayoutEditing: boolean
}

const DashboardLayoutContext =
  React.createContext<DashboardLayoutContextValue | null>(null)

export function DashboardLayoutProvider({
  isLayoutEditing,
  children,
}: {
  isLayoutEditing: boolean
  children: React.ReactNode
}) {
  const value = React.useMemo(
    () => ({ isLayoutEditing }),
    [isLayoutEditing]
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
