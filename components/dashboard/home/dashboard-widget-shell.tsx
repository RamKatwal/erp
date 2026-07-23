"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"

import { useDashboardLayoutEdit } from "@/components/dashboard/home/dashboard-layout-context"
import { WidgetRemoveButton } from "@/components/dashboard/home/widget-remove-button"
import type { DashboardWidgetId } from "@/lib/dashboard/default-layout"
import { cn } from "@/lib/utils"

type DashboardWidgetShellProps = {
  widgetId: DashboardWidgetId
  title: string
  action?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function DashboardWidgetShell({
  widgetId,
  title,
  action,
  footer,
  children,
  className,
  contentClassName,
}: DashboardWidgetShellProps) {
  const { isLayoutEditing } = useDashboardLayoutEdit()

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10",
        isLayoutEditing && "pb-8",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b px-4 h-11",
          isLayoutEditing && "cursor-grab active:cursor-grabbing"
        )}
      >
        {isLayoutEditing ? (
          <span
            aria-hidden
            className="inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground"
          >
            <GripVertical className="size-3.5" />
          </span>
        ) : null}
        <span className="flex-1 text-sm font-semibold">{title}</span>
        {action && !isLayoutEditing ? (
          <div className="dashboard-no-drag shrink-0">{action}</div>
        ) : null}
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3",
          contentClassName
        )}
      >
        {children}
      </div>
      {footer && !isLayoutEditing ? (
        <div className="dashboard-no-drag flex h-11 shrink-0 items-center border-t px-4 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
      <WidgetRemoveButton
        widgetId={widgetId}
        className="absolute bottom-2 left-3"
      />
    </div>
  )
}
