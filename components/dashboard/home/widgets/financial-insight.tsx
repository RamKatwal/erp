"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { PeriodSelect } from "@/components/dashboard/home/period-select"
import { DASHBOARD_WIDGET_IDS } from "@/lib/dashboard/default-layout"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { financialInsightData } from "@/lib/dashboard/mock-data"
import { formatCurrency2 } from "@/lib/dashboard/format"
import { chartColor } from "@/lib/dashboard/chart-colors"

const chartConfig = {
  inflow: {
    label: "In",
    color: chartColor(2),
  },
  outflow: {
    label: "Out",
    color: chartColor(3),
  },
} satisfies ChartConfig

export function FinancialInsightWidget() {
  const totals = financialInsightData.reduce(
    (acc, item) => {
      acc.inflow += item.inflow
      acc.outflow += item.outflow
      return acc
    },
    { inflow: 0, outflow: 0 }
  )

  return (
    <DashboardWidgetShell
      widgetId={DASHBOARD_WIDGET_IDS.financialInsight}
      title="Financial Insight"
      action={<PeriodSelect />}
      footer={
        <div className="flex w-full flex-nowrap items-center gap-4 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <ArrowDownRight className="size-3.5" />
            </span>
            <span className="truncate">
              In{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(totals.inflow)}
              </span>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <ArrowUpRight className="size-3.5" />
            </span>
            <span className="truncate">
              Out{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(totals.outflow)}
              </span>
            </span>
          </div>
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart
          data={financialInsightData}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="inflow"
            stroke="var(--color-inflow)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-inflow)" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="outflow"
            stroke="var(--color-outflow)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </DashboardWidgetShell>
  )
}
