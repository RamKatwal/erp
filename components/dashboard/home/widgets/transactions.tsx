"use client"

import * as React from "react"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { dashboardTransactions } from "@/lib/dashboard/mock-data"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "all", label: "All" },
  { id: "purchase", label: "Purchase" },
  { id: "sales", label: "Sales" },
  { id: "accounting", label: "Accounting" },
] as const

type TransactionTab = (typeof tabs)[number]["id"]

export function TransactionsWidget() {
  const [activeTab, setActiveTab] = React.useState<TransactionTab>("all")

  const filteredTransactions = React.useMemo(() => {
    if (activeTab === "all") return dashboardTransactions
    return dashboardTransactions.filter((item) => item.type === activeTab)
  }, [activeTab])

  return (
    <DashboardWidgetShell
      title="Transactions"
      action={
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-2 py-1 text-xs transition-colors",
                activeTab === tab.id
                  ? "bg-teal-50 font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
      contentClassName="py-0"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-auto">
          <ul className="divide-y">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center gap-3 px-1 py-3 text-xs"
              >
                <span className="w-24 shrink-0 text-muted-foreground">
                  {transaction.date}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{transaction.customer}</p>
                  <p className="truncate text-muted-foreground">
                    {transaction.description}
                  </p>
                </div>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatCurrency(transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardWidgetShell>
  )
}
