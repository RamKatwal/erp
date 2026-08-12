"use client"

import { CheckIcon, FileTextIcon } from "lucide-react"

import { CapacityMeter } from "@/components/admin/subscriptions/sections/capacity-meter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/lib/format"
import {
  billingIntervalLabels,
  formatPaymentMethodSummary,
  type Subscription,
} from "@/types/subscription"

type OverviewSectionProps = {
  subscription: Subscription
  autoRenew: boolean
  onAutoRenewChange: (value: boolean) => void
  onShowInvoices: () => void
}

export function OverviewSection({
  subscription,
  autoRenew,
  onAutoRenewChange,
  onShowInvoices,
}: OverviewSectionProps) {
  const recentInvoices = subscription.invoices.slice(0, 3)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <CapacityMeter
          label="Branch Capacity"
          used={subscription.branchesUsed}
          limit={subscription.branchesLimit}
          usageLabel="Branches Provisioned"
          remainingLabel="Branch slots remaining"
        />
        <CapacityMeter
          label="User Seat Capacity"
          used={subscription.usersUsed}
          limit={subscription.usersLimit}
          usageLabel="User Seats Active"
          remainingLabel="User seats remaining"
        />
      </div>

      <section className="rounded-xl border bg-card p-4 shadow-xs">
        <h2 className="text-sm font-semibold">Plan contract & billing</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Plan Tier</dt>
              <dd className="text-right font-medium">{subscription.planTier}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Recurring Amount</dt>
              <dd className="text-right font-medium tabular-nums">
                {formatCurrency(subscription.amount, subscription.currency)} /{" "}
                {subscription.interval === "year" ? "year" : "month"}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Payment Method</dt>
              <dd className="text-right font-medium">
                {formatPaymentMethodSummary(subscription.paymentMethod)}
              </dd>
            </div>
          </dl>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Next Billing Date</dt>
              <dd className="text-right font-medium">
                {subscription.nextBillingDate}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Auto-Renewal</dt>
              <dd className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {autoRenew ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={autoRenew}
                  onCheckedChange={onAutoRenewChange}
                  aria-label="Toggle auto-renewal"
                />
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Billing Contact</dt>
              <dd className="text-right font-medium">
                {subscription.paymentMethod?.billingEmail ?? "—"}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted-foreground">Billing Cycle</dt>
              <dd className="text-right font-medium">
                {billingIntervalLabels[subscription.interval]}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4 shadow-xs">
        <h2 className="text-sm font-semibold">Included plan features</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {subscription.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Recent invoices</h2>
          <Button variant="outline" size="sm" onClick={onShowInvoices}>
            View all
          </Button>
        </div>
        {recentInvoices.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No invoices yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Invoice ID</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Period Covered</th>
                  <th className="px-4 py-2.5 font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.invoiceId} className="border-b last:border-0">
                    <td className="px-4 py-2.5 font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {invoice.issueDate}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {invoice.periodStart} – {invoice.periodEnd}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={
                          invoice.status === "Paid"
                            ? "default"
                            : invoice.status === "Past due"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Download ${invoice.invoiceNumber}`}
                        nativeButton={false}
                        render={
                          <a
                            href={invoice.pdfDownloadUrl}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                      >
                        <FileTextIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
