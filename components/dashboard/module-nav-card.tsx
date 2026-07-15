import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const accentStyles = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
] as const

type ModuleNavCardProps = {
  title: string
  description: string
  href: string
  icon: LucideIcon
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
