"use client"

import * as React from "react"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { DashboardWidgetTabs } from "@/components/dashboard/home/dashboard-widget-tabs"
import { DASHBOARD_WIDGET_IDS } from "@/lib/dashboard/default-layout"
import {
  payableAgeingDue,
  payableAgeingUpcoming,
} from "@/lib/dashboard/mock-data"

const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "due", label: "Due" },
] as const

type PayableAgeingTab = (typeof tabs)[number]["id"]

function formatAmount(value: number) {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })
}

export function PayableAgeingWidget() {
  const [activeTab, setActiveTab] = React.useState<PayableAgeingTab>("upcoming")

  const rows =
    activeTab === "upcoming" ? payableAgeingUpcoming : payableAgeingDue
  const daysLabel = activeTab === "upcoming" ? "Due In" : "Overdue"

  return (
    <DashboardWidgetShell
      widgetId={DASHBOARD_WIDGET_IDS.payableAgeing}
      title="Payable Ageing Summary"
      contentClassName="gap-3 px-0 py-0"
    >
      <DashboardWidgetTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="thin-scrollbar min-h-0 flex-1 overflow-auto px-4 pb-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="rounded-l-md px-3 py-2.5 font-medium">
                Supplier Name
              </th>
              <th className="px-3 py-2.5 font-medium">Amount</th>
              <th className="rounded-r-md px-3 py-2.5 text-right font-medium">
                {daysLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-3 text-foreground">{row.supplier}</td>
                <td className="px-3 py-3 tabular-nums text-foreground">
                  {formatAmount(row.amount)}
                </td>
                <td className="px-3 py-3 text-right text-muted-foreground">
                  {row.days} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardWidgetShell>
  )
}
