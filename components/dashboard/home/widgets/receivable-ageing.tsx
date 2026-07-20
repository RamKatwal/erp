"use client"

import Link from "next/link"
import { IndianRupee } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
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

const chartConfig = {
  amount: {
    label: "Amount",
  },
  recent: {
    label: "5 - 9 days",
    color: "hsl(210 70% 55%)",
  },
  overdue: {
    label: "10+ days",
    color: "hsl(38 70% 58%)",
  },
} satisfies ChartConfig

const totalAmount = receivableAgeingData.reduce((sum, d) => sum + d.amount, 0)

export function ReceivableAgeingWidget() {
  return (
    <DashboardWidgetShell
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
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-foreground">
            <IndianRupee className="size-3.5" />
          </span>
          <span>
            Total Amount{" "}
            <span className="font-medium text-foreground">
              {formatCurrency2(totalAmount)}
            </span>
          </span>
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="mx-auto h-full w-full max-w-[200px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={receivableAgeingData}
            dataKey="amount"
            nameKey="bucket"
            innerRadius="60%"
            outerRadius="80%"
            strokeWidth={2}
          >
            {receivableAgeingData.map((entry) => (
              <Cell
                key={entry.bucket}
                fill={`var(--color-${entry.bucket})`}
              />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="bucket" />} />
        </PieChart>
      </ChartContainer>
    </DashboardWidgetShell>
  )
}
