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
import { receivablesPayablesData } from "@/lib/dashboard/mock-data"
import { formatCurrency2 } from "@/lib/dashboard/format"

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(160 55% 42%)",
  },
  Receivables: {
    label: "Receivables",
    color: "hsl(160 55% 42%)",
  },
  Payables: {
    label: "Payables",
    color: "hsl(32 75% 58%)",
  },
} satisfies ChartConfig

const chartData = receivablesPayablesData.map((item) => ({
  ...item,
  fill:
    item.category === "Receivables"
      ? "var(--color-Receivables)"
      : "var(--color-Payables)",
}))

export function ReceivablesPayablesWidget() {
  const receivables = receivablesPayablesData.find(
    (item) => item.category === "Receivables"
  )?.amount
  const payables = receivablesPayablesData.find(
    (item) => item.category === "Payables"
  )?.amount

  return (
    <DashboardWidgetShell
      title="Receivables vs Payables"
      action={<PeriodSelect />}
      footer={
        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[hsl(160_55%_42%)]" />
            <span>
              Receivables{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(receivables ?? 0)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[hsl(32_75%_58%)]" />
            <span>
              Payables{" "}
              <span className="font-medium text-foreground">
                {formatCurrency2(payables ?? 0)}
              </span>
            </span>
          </div>
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ChartContainer>
    </DashboardWidgetShell>
  )
}
