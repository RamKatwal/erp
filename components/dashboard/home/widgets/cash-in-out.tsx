"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { PeriodSelect } from "@/components/dashboard/home/period-select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DASHBOARD_WIDGET_IDS } from "@/lib/dashboard/default-layout"
import { formatCurrency2 } from "@/lib/dashboard/format"
import { cashInOutData } from "@/lib/dashboard/mock-data"
import { chartColor } from "@/lib/dashboard/chart-colors"

const chartConfig = {
  cashIn: {
    label: "Cash in",
    color: chartColor(2),
  },
  cashOut: {
    label: "Cash out",
    color: chartColor(9),
  },
} satisfies ChartConfig

export function CashInOutWidget() {
  const totals = cashInOutData.reduce(
    (acc, item) => {
      acc.cashIn += item.cashIn
      acc.cashOut += item.cashOut
      return acc
    },
    { cashIn: 0, cashOut: 0 }
  )
  const difference = totals.cashIn - totals.cashOut

  return (
    <DashboardWidgetShell
      widgetId={DASHBOARD_WIDGET_IDS.cashInOut}
      title="Cash In and Out"
      action={<PeriodSelect />}
      footer={
        <div className="flex w-full flex-nowrap items-center gap-x-6 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: chartColor(6) }}
              />
            </span>
            <span className="truncate">
              Cash in{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(totals.cashIn)}
              </span>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate">
              Difference{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(difference)}
              </span>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: chartColor(4) }}
              />
            </span>
            <span className="truncate">
              Cash out{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(totals.cashOut)}
              </span>
            </span>
          </div>
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          data={cashInOutData}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="cashIn"
            fill="var(--color-cashIn)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="cashOut"
            fill="var(--color-cashOut)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ChartContainer>
    </DashboardWidgetShell>
  )
}
