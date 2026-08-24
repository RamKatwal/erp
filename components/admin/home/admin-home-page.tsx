"use client"

import { KpiStrip } from "@/components/admin/home/kpi-strip"
import { CompanyListsPage } from "@/components/admin/company-lists-page"
import { computeAdminHomeMetrics } from "@/lib/admin/home-metrics"
import { mockSubscriptions } from "@/lib/mock/subscriptions"

export function AdminHomePage() {
  const { kpis } = computeAdminHomeMetrics(mockSubscriptions)

  return (
    <div className="flex flex-col gap-4">
      <KpiStrip kpis={kpis} />

      <CompanyListsPage />
    </div>
  )
}
