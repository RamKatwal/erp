"use client"

import { Minus } from "lucide-react"

import { useDashboardLayoutEdit } from "@/components/dashboard/home/dashboard-layout-context"
import type { DashboardWidgetId } from "@/lib/dashboard/default-layout"
import { cn } from "@/lib/utils"

type WidgetRemoveButtonProps = {
  widgetId: DashboardWidgetId
  label?: string
  className?: string
}

export function WidgetRemoveButton({
  widgetId,
  label = "Remove",
  className,
}: WidgetRemoveButtonProps) {
  const { isLayoutEditing, removeWidget } = useDashboardLayoutEdit()

  if (!isLayoutEditing) return null

  return (
    <button
      type="button"
      className={cn(
        "dashboard-no-drag inline-flex items-center gap-1.5 rounded-full text-xs font-medium text-muted-foreground transition-colors",
        "hover:text-foreground",
        className
      )}
      onClick={() => removeWidget(widgetId)}
    >
      <span className="inline-flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs">
        <Minus className="size-3" strokeWidth={2.5} />
      </span>
      {label}
    </button>
  )
}
