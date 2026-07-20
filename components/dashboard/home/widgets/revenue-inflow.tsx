"use client"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { PeriodSelect } from "@/components/dashboard/home/period-select"
import { revenueInflowStats } from "@/lib/dashboard/mock-data"
import { formatCurrency } from "@/lib/format"

export function RevenueInflowWidget() {
  return (
    <DashboardWidgetShell title="Revenue Inflow" action={<PeriodSelect />}>
      <div className="grid auto-rows-fr grid-cols-2 gap-3">
        {revenueInflowStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-center rounded-lg border bg-muted/20 px-4 py-3"
          >
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrency(stat.value)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </DashboardWidgetShell>
  )
}
