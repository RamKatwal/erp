"use client"

import Link from "next/link"
import { IndianRupee } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { DASHBOARD_WIDGET_IDS } from "@/lib/dashboard/default-layout"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { receivableAgeingData } from "@/lib/dashboard/mock-data"
import { formatCurrency2 } from "@/lib/dashboard/format"
import { chartColor } from "@/lib/dashboard/chart-colors"

const chartConfig = {
  amount: {
    label: "Amount",
  },
  current: {
    label: "Current",
    color: chartColor(2),
  },
  days0to4: {
    label: "0 - 4 days",
    color: chartColor(3),
  },
  recent: {
    label: "5 - 9 days",
    color: chartColor(4),
  },
  overdue: {
    label: "10+ days",
    color: chartColor(9),
  },
} satisfies ChartConfig

const totalAmount = receivableAgeingData.reduce((sum, d) => sum + d.amount, 0)

export function ReceivableAgeingWidget() {
  return (
    <DashboardWidgetShell
      widgetId={DASHBOARD_WIDGET_IDS.receivableAgeing}
      title="Receivable Ageing Summary"
      action={
        <Link
          href="/reports"
          className="text-xs font-medium text-foreground hover:underline"
        >
          View all
        </Link>
      }
      footer={
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-hidden">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <IndianRupee className="size-3.5" />
          </span>
          <span className="truncate">
            Total Amount{" "}
            <span className="font-medium text-foreground">
              {formatCurrency2(totalAmount)}
            </span>
          </span>
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="mx-auto h-full w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={receivableAgeingData}
            dataKey="amount"
            nameKey="bucket"
            innerRadius="55%"
            outerRadius="75%"
            stroke="var(--background)"
            strokeWidth={2}
          >
            {receivableAgeingData.map((entry) => (
              <Cell
                key={entry.bucket}
                fill={`var(--color-${entry.bucket})`}
              />
            ))}
          </Pie>
          <ChartLegend
            content={
              <ChartLegendContent
                nameKey="bucket"
                className="flex-nowrap gap-3 whitespace-nowrap [&>div]:shrink-0 [&>div]:whitespace-nowrap"
              />
            }
          />
        </PieChart>
      </ChartContainer>
    </DashboardWidgetShell>
  )
}
