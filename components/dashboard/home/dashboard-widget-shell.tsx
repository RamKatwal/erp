"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"

import { useDashboardLayoutEdit } from "@/components/dashboard/home/dashboard-layout-context"
import { cn } from "@/lib/utils"

type DashboardWidgetShellProps = {
  title: string
  action?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
  hug?: boolean
}

export function DashboardWidgetShell({
  title,
  action,
  footer,
  children,
  className,
  contentClassName,
  hug = false,
}: DashboardWidgetShellProps) {
  const { isLayoutEditing } = useDashboardLayoutEdit()

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10",
        !hug && "h-full",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b px-4",
          hug ? "py-2" : "py-2.5"
        )}
      >
        {isLayoutEditing ? (
          <button
            type="button"
            aria-label={`Drag ${title}`}
            className="dashboard-drag-handle -ml-1 inline-flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-3.5" />
          </button>
        ) : null}
        <span className="flex-1 text-sm font-semibold">{title}</span>
        {action}
      </div>
      <div
        className={cn(
          "flex flex-col px-4",
          hug
            ? "shrink-0 py-2"
            : "min-h-0 flex-1 flex-col overflow-hidden py-3",
          contentClassName
        )}
      >
        {children}
      </div>
      {footer ? (
        <div className="shrink-0 border-t px-4 py-2.5 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
