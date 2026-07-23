"use client"

import { Banknote, Building2, Wallet } from "lucide-react"

import { DashboardWidgetShell } from "@/components/dashboard/home/dashboard-widget-shell"
import { DASHBOARD_WIDGET_IDS } from "@/lib/dashboard/default-layout"
import { formatCurrency2 } from "@/lib/dashboard/format"
import {
  bankCashAccounts,
  type BankCashAccount,
} from "@/lib/dashboard/mock-data"

function AccountIcon({ kind }: { kind: BankCashAccount["kind"] }) {
  const Icon = kind === "cash" ? Banknote : kind === "wallet" ? Wallet : Building2

  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
      <Icon className="size-3.5" />
    </span>
  )
}

export function BankCashBalanceWidget() {
  const total = bankCashAccounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <DashboardWidgetShell
      widgetId={DASHBOARD_WIDGET_IDS.bankCashBalance}
      title="Bank and Cash Balance"
      contentClassName="py-0"
      footer={
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-hidden">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <Banknote className="size-3.5" />
          </span>
          <span className="truncate">
            Total Balance{" "}
            <span className="font-medium text-foreground">
              {formatCurrency2(total)}
            </span>
          </span>
        </div>
      }
    >
      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
        <ul className="divide-y">
          {bankCashAccounts.map((account) => (
            <li
              key={account.id}
              className="flex items-center gap-3 px-1 py-3"
            >
              <AccountIcon kind={account.kind} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{account.name}</p>
                {account.accountNumber ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {account.accountNumber}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-muted-foreground">Balance</p>
                <p className="text-sm font-medium tabular-nums">
                  {formatCurrency2(account.balance)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardWidgetShell>
  )
}
