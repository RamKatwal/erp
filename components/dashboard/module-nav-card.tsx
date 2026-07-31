import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { NavIcon } from "@/types/navigation"

const accentStyles = [
  "bg-chart-6/10 text-chart-6-active",
  "bg-chart-7/10 text-chart-7-active",
  "bg-chart-5/10 text-chart-5-active",
  "bg-chart-9/10 text-chart-9-active",
  "bg-chart-10/10 text-chart-10-active",
  "bg-chart-11/10 text-chart-11-active",
] as const

type ModuleNavCardProps = {
  title: string
  description: string
  href: string
  icon: NavIcon
  accentIndex?: number
}

export function ModuleNavCard({
  title,
  description,
  href,
  icon: Icon,
  accentIndex = 0,
}: ModuleNavCardProps) {
  const accent = accentStyles[accentIndex % accentStyles.length]

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            accent
          )}
        >
          <Icon className="size-5" />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="space-y-1">
        <h3 className="font-medium leading-none tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  )
}
