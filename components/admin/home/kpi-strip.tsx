"use client"

import type { LucideIcon } from "lucide-react"
import {
  Building2Icon,
  GitBranchIcon,
  LayersIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { HomeKpi, TrendDirection } from "@/lib/admin/home-metrics"
import { cn } from "@/lib/utils"

const kpiIcons: Record<string, LucideIcon> = {
  organizations: Building2Icon,
  branches: GitBranchIcon,
  users: UsersIcon,
  mrr: WalletIcon,
  "attach-rate": LayersIcon,
}

function trendBadgeClass(trend: TrendDirection) {
  switch (trend) {
    case "up":
      return "border-transparent bg-foreground text-background"
    case "down":
      return "border-transparent bg-destructive/10 text-destructive"
    default:
      return "border-transparent bg-muted text-muted-foreground"
  }
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === "up") {
    return <TrendingUpIcon className="size-2.5" aria-hidden />
  }
  if (trend === "down") {
    return <TrendingDownIcon className="size-2.5" aria-hidden />
  }
  return null
}

type KpiStripProps = {
  kpis: HomeKpi[]
}

export function KpiStrip({ kpis }: KpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {kpis.map((kpi) => {
        const Icon = kpiIcons[kpi.id] ?? Building2Icon

        return (
          <div
            key={kpi.id}
            className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-4 shadow-xs"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <Icon className="size-4" strokeWidth={1.75} aria-hidden />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="truncate text-xs text-muted-foreground">{kpi.label}</p>

              <div className="flex flex-wrap items-center gap-2">
                <p className="text-2xl font-semibold tracking-tight tabular-nums">
                  {kpi.value}
                </p>
                <Badge
                  className={cn(
                    "h-5 gap-0.5 rounded-full px-1.5 text-[10px] font-medium tabular-nums",
                    trendBadgeClass(kpi.trend)
                  )}
                >
                  <TrendIcon trend={kpi.trend} />
                  {kpi.changeLabel}
                </Badge>
              </div>

              <p className="text-[11px] leading-snug text-muted-foreground">
                {kpi.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
