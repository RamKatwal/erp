"use client"

import * as React from "react"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { DashboardWidgetTabs } from "@/components/dashboard/home/dashboard-widget-tabs"
import { DASHBOARD_WIDGET_IDS } from "@/lib/dashboard/default-layout"
import { dashboardTransactions } from "@/lib/dashboard/mock-data"
import { formatCurrency } from "@/lib/format"

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
      widgetId={DASHBOARD_WIDGET_IDS.transactions}
      title="Transactions"
      contentClassName="gap-3 px-0 py-0"
    >
      <DashboardWidgetTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="thin-scrollbar min-h-0 flex-1 overflow-auto px-4 pb-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="rounded-l-md px-3 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Party</th>
              <th className="px-3 py-2.5 font-medium">Description</th>
              <th className="rounded-r-md px-3 py-2.5 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-3 py-3 text-muted-foreground">
                  {transaction.date}
                </td>
                <td className="px-3 py-3 text-foreground">
                  {transaction.customer}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {transaction.description}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardWidgetShell>
  )
}
