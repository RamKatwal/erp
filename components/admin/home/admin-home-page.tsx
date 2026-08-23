"use client"

import { KpiStrip } from "@/components/admin/home/kpi-strip"
import { NeedsAttentionPanel } from "@/components/admin/home/needs-attention-panel"
import { QuickActions } from "@/components/admin/home/quick-actions"
import { RecentActivityPanel } from "@/components/admin/home/recent-activity-panel"
import { PageHeader } from "@/components/layout/page-header"
import { computeAdminHomeMetrics } from "@/lib/admin/home-metrics"
import { mockAdminActivity } from "@/lib/mock/admin-activity"
import { mockSubscriptions } from "@/lib/mock/subscriptions"

export function AdminHomePage() {
  const { kpis, attentionItems } = computeAdminHomeMetrics(mockSubscriptions)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Home" />

      <KpiStrip kpis={kpis} />

      <div className="grid gap-4 lg:grid-cols-2">
        <NeedsAttentionPanel items={attentionItems} />
        <RecentActivityPanel events={mockAdminActivity} />
      </div>

      <QuickActions organizations={mockSubscriptions} />
    </div>
  )
}
