"use client"

import Link from "next/link"

import {
  DuoAccountingIcon,
  DuoOrderIcon,
  DuoPaymentsIcon,
  DuoProductsIcon,
} from "@/components/icons/duo"
import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { Button } from "@/components/ui/button"
import { quickAccessActions } from "@/lib/dashboard/mock-data"
import type { NavIcon } from "@/types/navigation"

const quickAccessIcons: Record<string, NavIcon> = {
  "/inventory/products": DuoProductsIcon,
  "/purchase/order": DuoOrderIcon,
  "/purchase/payments": DuoPaymentsIcon,
  "/sales/order": DuoOrderIcon,
  "/sales/payments": DuoPaymentsIcon,
  "/accounting": DuoAccountingIcon,
}

export function QuickAccessWidget() {
  return (
    <DashboardWidgetShell title="Quick Access" hug>
      <div className="grid w-full grid-cols-6 gap-2">
        {quickAccessActions.map((action) => {
          const Icon = quickAccessIcons[action.href]

          return (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="h-8 w-full min-w-0 gap-1.5 px-2 text-xs font-normal"
              render={<Link href={action.href} />}
            >
              {Icon ? (
                <Icon className="size-3.5 shrink-0 text-foreground" />
              ) : null}
              <span className="truncate">{action.label}</span>
            </Button>
          )
        })}
      </div>
    </DashboardWidgetShell>
  )
}
