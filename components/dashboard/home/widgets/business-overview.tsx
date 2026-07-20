"use client"

import {
  DuoExpenseIcon,
  DuoPaymentsIcon,
  DuoPurchaseIcon,
  DuoSalesIcon,
} from "@/components/icons/duo"
import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { PeriodSelect } from "@/components/dashboard/home/period-select"
import { businessOverviewStats } from "@/lib/dashboard/mock-data"
import { formatCurrency } from "@/lib/format"

const statIcons = [
  DuoSalesIcon,
  DuoPaymentsIcon,
  DuoPurchaseIcon,
  DuoExpenseIcon,
] as const

const iconContainerClass =
  "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground"

export function BusinessOverviewWidget() {
  return (
    <DashboardWidgetShell
      title="Business Overview"
      action={<PeriodSelect />}
      hug
    >
      <div className="grid w-full grid-cols-4 gap-2">
        {businessOverviewStats.map((stat, index) => {
          const Icon = statIcons[index]

          return (
            <div
              key={stat.label}
              className="flex min-w-0 items-center gap-2.5 rounded-lg border bg-muted/20 px-2.5 py-2"
            >
              <div className={iconContainerClass}>
                <Icon className="size-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold tabular-nums leading-tight">
                  {formatCurrency(stat.value)}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardWidgetShell>
  )
}
