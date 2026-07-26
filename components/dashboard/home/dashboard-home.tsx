"use client"

import { DashboardGrid } from "@/components/dashboard/home/dashboard-grid"
import { getCurrentUser, isMainAdmin } from "@/lib/auth/current-user"
import { getGroupDashboardLayoutStorageKey } from "@/lib/groups/storage"

export function DashboardHome() {
  const user = getCurrentUser()

  if (isMainAdmin(user)) {
    return <DashboardGrid />
  }

  return (
    <DashboardGrid
      storageKey={getGroupDashboardLayoutStorageKey(user.groupId)}
      readOnly
    />
  )
}
