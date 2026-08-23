import type * as React from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: React.ReactNode
  /** Muted chip rendered next to the title, e.g. "41 reviews". */
  count?: string | number
  /** Free-form node rendered next to the title, e.g. a status badge. */
  badge?: React.ReactNode
  actions?: React.ReactNode
  /** Rendered above the title, e.g. a back link. */
  breadcrumb?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  count,
  badge,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      data-slot="page-header"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        {breadcrumb}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-base font-semibold tracking-tight">
            {title}
          </h1>
          {count !== undefined ? (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
              {count}
            </span>
          ) : null}
          {badge}
        </div>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
