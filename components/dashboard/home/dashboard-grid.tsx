"use client"

import * as React from "react"
import type { Layout, ResponsiveLayouts } from "react-grid-layout"
import { Responsive, WidthProvider } from "react-grid-layout/legacy"
import { Check, LayoutGrid, RotateCcw } from "lucide-react"

import { DashboardLayoutProvider } from "@/components/dashboard/home/dashboard-layout-context"
import { BusinessOverviewWidget } from "@/components/dashboard/home/widgets/business-overview"
import { Button } from "@/components/ui/button"
import { FinancialInsightWidget } from "@/components/dashboard/home/widgets/financial-insight"
import { QuickAccessWidget } from "@/components/dashboard/home/widgets/quick-access"
import { ReceivableAgeingWidget } from "@/components/dashboard/home/widgets/receivable-ageing"
import { ReceivablesPayablesWidget } from "@/components/dashboard/home/widgets/receivables-payables"
import { RevenueInflowWidget } from "@/components/dashboard/home/widgets/revenue-inflow"
import { TransactionsWidget } from "@/components/dashboard/home/widgets/transactions"
import {
  areDashboardLayoutsEqual,
  DASHBOARD_LAYOUT_STORAGE_KEY,
  DASHBOARD_WIDGET_IDS,
  defaultDashboardLayouts,
} from "@/lib/dashboard/default-layout"
import { cn } from "@/lib/utils"

import "react-grid-layout/css/styles.css"

// Bump this version whenever the default layout changes to invalidate stale saved layouts
const LAYOUT_VERSION = 8

const ResponsiveGridLayout = WidthProvider(Responsive)

const widgetMap = {
  [DASHBOARD_WIDGET_IDS.financialInsight]: FinancialInsightWidget,
  [DASHBOARD_WIDGET_IDS.receivablesPayables]: ReceivablesPayablesWidget,
  [DASHBOARD_WIDGET_IDS.receivableAgeing]: ReceivableAgeingWidget,
  [DASHBOARD_WIDGET_IDS.quickAccess]: QuickAccessWidget,
  [DASHBOARD_WIDGET_IDS.revenueInflow]: RevenueInflowWidget,
  [DASHBOARD_WIDGET_IDS.transactions]: TransactionsWidget,
} as const

export function DashboardGrid() {
  const [isLayoutEditing, setIsLayoutEditing] = React.useState(false)
  const [hasCustomLayout, setHasCustomLayout] = React.useState(false)
  const [layoutKey, setLayoutKey] = React.useState(0)
  const [layouts, setLayouts] =
    React.useState<ResponsiveLayouts>(defaultDashboardLayouts)

  React.useEffect(() => {
    const versionKey = `${DASHBOARD_LAYOUT_STORAGE_KEY}-version`
    const savedVersion = window.localStorage.getItem(versionKey)

    if (savedVersion !== String(LAYOUT_VERSION)) {
      window.localStorage.removeItem(DASHBOARD_LAYOUT_STORAGE_KEY)
      window.localStorage.setItem(versionKey, String(LAYOUT_VERSION))
      return
    }

    const saved = window.localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as ResponsiveLayouts
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLayouts(parsed)
      setHasCustomLayout(!areDashboardLayoutsEqual(parsed, defaultDashboardLayouts))
    } catch {
      window.localStorage.removeItem(DASHBOARD_LAYOUT_STORAGE_KEY)
    }
  }, [])

  const handleLayoutChange = React.useCallback(
    (_currentLayout: Layout, allLayouts: ResponsiveLayouts) => {
      if (!isLayoutEditing) return

      setLayouts(allLayouts)
      window.localStorage.setItem(
        DASHBOARD_LAYOUT_STORAGE_KEY,
        JSON.stringify(allLayouts)
      )
      setHasCustomLayout(
        !areDashboardLayoutsEqual(allLayouts, defaultDashboardLayouts)
      )
    },
    [isLayoutEditing]
  )

  const handleResetLayout = React.useCallback(() => {
    window.localStorage.removeItem(DASHBOARD_LAYOUT_STORAGE_KEY)
    setLayouts(defaultDashboardLayouts)
    setHasCustomLayout(false)
    setLayoutKey((current) => current + 1)
  }, [])

  return (
    <DashboardLayoutProvider isLayoutEditing={isLayoutEditing}>
      <BusinessOverviewWidget />

      <div
        className={`dashboard-grid -mx-1${isLayoutEditing ? " dashboard-grid--editing" : ""}`}
      >
        <ResponsiveGridLayout
          key={layoutKey}
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={34}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          draggableHandle=".dashboard-drag-handle"
          draggableCancel=".dashboard-no-drag"
          isResizable={isLayoutEditing}
          isDraggable={isLayoutEditing}
          compactType="vertical"
          onLayoutChange={handleLayoutChange}
        >
          {Object.entries(widgetMap).map(([id, Widget]) => (
            <div
              key={id}
              className={cn(
                "dashboard-grid-item",
                id === DASHBOARD_WIDGET_IDS.quickAccess &&
                  "dashboard-grid-item--hug"
              )}
            >
              <Widget />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {hasCustomLayout ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shadow-md"
            onClick={handleResetLayout}
          >
            <RotateCcw />
            Reset layout
          </Button>
        ) : null}
        <Button
          type="button"
          variant={isLayoutEditing ? "default" : "outline"}
          size="sm"
          className="shadow-md"
          onClick={() => setIsLayoutEditing((current) => !current)}
        >
          {isLayoutEditing ? (
            <>
              <Check />
              Done
            </>
          ) : (
            <>
              <LayoutGrid />
              Edit layout
            </>
          )}
        </Button>
      </div>
    </DashboardLayoutProvider>
  )
}
