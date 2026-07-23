"use client"

import { cn } from "@/lib/utils"

export type DashboardWidgetTab<T extends string = string> = {
  id: T
  label: string
}

type DashboardWidgetTabsProps<T extends string> = {
  tabs: readonly DashboardWidgetTab<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  className?: string
}

export function DashboardWidgetTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: DashboardWidgetTabsProps<T>) {
  return (
    <div
      className={cn(
        "dashboard-no-drag flex shrink-0 gap-5 border-b px-4",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "-mb-px border-b-2 px-0.5 pb-2.5 pt-3 text-sm transition-colors",
            activeTab === tab.id
              ? "border-foreground font-medium text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
