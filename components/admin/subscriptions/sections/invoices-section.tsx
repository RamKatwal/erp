"use client"

import * as React from "react"
import { DownloadIcon, EyeIcon, FileTextIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { formatCurrency, formatLongDate } from "@/lib/format"
import { paymentMethodLogoSrc } from "@/lib/onboarding/plans"
import { invoiceReceiptPath } from "@/lib/mock/invoice-receipt"
import {
  billingIntervalLabels,
  invoiceBilledForLabel,
  invoiceChargeTypeLabels,
  paymentProviderLabels,
  type BillingInterval,
  type InvoiceChargeType,
  type Subscription,
  type SubscriptionInvoice,
  type SubscriptionPaymentMethod,
} from "@/types/subscription"

function invoiceDownloadHref(invoice: SubscriptionInvoice) {
  if (invoice.pdfDownloadUrl && invoice.pdfDownloadUrl !== "#") {
    return invoice.pdfDownloadUrl
  }
  return invoiceReceiptPath(invoice.invoiceId)
}

function invoiceStatusVariant(
  status: SubscriptionInvoice["status"]
): "default" | "destructive" | "secondary" {
  if (status === "Paid") return "default"
  if (status === "Past due") return "destructive"
  return "secondary"
}

function PaymentMethodCell({
  method,
}: {
  method: SubscriptionPaymentMethod | null
}) {
  if (!method) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex size-6 items-center justify-center rounded-md border bg-background p-0.5">
        <img
          src={paymentMethodLogoSrc[method.provider]}
          alt=""
          width={16}
          height={16}
          className="size-4 object-contain"
        />
      </span>
      <span>{paymentProviderLabels[method.provider]}</span>
    </span>
  )
}

function invoiceChargeType(
  invoice: SubscriptionInvoice
): InvoiceChargeType {
  return invoice.chargeType ?? "plan"
}

function invoiceInterval(
  invoice: SubscriptionInvoice,
  subscription: Subscription
): BillingInterval {
  return invoice.interval ?? subscription.interval
}

function paidUsersCount(invoice: SubscriptionInvoice) {
  const chargeType = invoiceChargeType(invoice)
  if (chargeType === "branches") return null
  if (chargeType === "users" || chargeType === "branches_and_users") {
    return invoice.addedUsers ?? 0
  }
  return invoice.usersLimit
}

function paidBranchesCount(invoice: SubscriptionInvoice) {
  const chargeType = invoiceChargeType(invoice)
  if (chargeType === "users") return null
  if (chargeType === "branches" || chargeType === "branches_and_users") {
    return invoice.addedBranches ?? 0
  }
  return invoice.branchesLimit
}

function QuantityCell({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>
  }
  return <span className="tabular-nums">{value}</span>
}

function BilledForCell({ invoice }: { invoice: SubscriptionInvoice }) {
  const chargeType = invoiceChargeType(invoice)
  if (chargeType === "plan") {
    return <span>{invoice.planName}</span>
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-medium">{invoiceChargeTypeLabels[chargeType]}</span>
      <span className="text-xs text-muted-foreground">{invoice.planName}</span>
    </div>
  )
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  )
}

function InvoiceDetailSheet({
  invoice,
  subscription,
  open,
  onOpenChange,
}: {
  invoice: SubscriptionInvoice
  subscription: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pdfHref = invoiceDownloadHref(invoice)
  const isPaid = invoice.status === "Paid"
  const chargeType = invoiceChargeType(invoice)
  const usersPaid = paidUsersCount(invoice)
  const branchesPaid = paidBranchesCount(invoice)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Invoice Details</SheetTitle>
          <SheetDescription>
            Invoice #{invoice.invoiceNumber}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {formatCurrency(invoice.amountPaid, invoice.currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPaid ? "Invoice paid" : "Invoice " + invoice.status.toLowerCase()}
              </p>
            </div>
            <Badge variant={invoiceStatusVariant(invoice.status)} className="text-xs">
              {invoice.status}
            </Badge>
          </div>

          <Separator className="my-4" />

          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Summary
          </h3>
          <div className="text-sm">
            <DetailRow label="Invoice number">
              {invoice.invoiceNumber}
            </DetailRow>
            <DetailRow label="Issue date">
              {formatLongDate(invoice.issueDate)}
            </DetailRow>
            <DetailRow label="Billed for">
              {invoiceBilledForLabel(invoice)}
            </DetailRow>
            <DetailRow label="Interval">
              {billingIntervalLabels[invoiceInterval(invoice, subscription)]}
            </DetailRow>
            {invoice.paymentMethod && (
              <DetailRow label="Payment method">
                <PaymentMethodCell method={invoice.paymentMethod} />
              </DetailRow>
            )}
          </div>

          <Separator className="my-4" />

          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Period
          </h3>
          <div className="text-sm">
            <DetailRow label="Start">
              {formatLongDate(invoice.periodStart)}
            </DetailRow>
            <DetailRow label="End">
              {formatLongDate(invoice.periodEnd)}
            </DetailRow>
          </div>

          <Separator className="my-4" />

          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {chargeType === "plan" ? "Paid allocation" : "This payment"}
          </h3>
          <div className="text-sm">
            {usersPaid !== null ? (
              <DetailRow
                label={chargeType === "plan" ? "Users" : "User seats"}
              >
                {usersPaid}
              </DetailRow>
            ) : null}
            {branchesPaid !== null ? (
              <DetailRow
                label={chargeType === "plan" ? "Branches" : "Branches"}
              >
                {branchesPaid}
              </DetailRow>
            ) : null}
          </div>

          <Separator className="my-4" />

          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Amount
          </h3>
          <div className="text-sm">
            <DetailRow label="Total due">
              {formatCurrency(invoice.amountPaid, invoice.currency)}
            </DetailRow>
            <DetailRow label="Amount paid">
              {formatCurrency(invoice.amountPaid, invoice.currency)}
            </DetailRow>
          </div>

          <Separator className="my-4" />

          <Button
            className="w-full"
            nativeButton={false}
            render={
              <a
                href={pdfHref}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <DownloadIcon className="mr-2 size-4" />
            Download invoice
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

type InvoicesSectionProps = {
  subscription: Subscription
}

export function InvoicesSection({ subscription }: InvoicesSectionProps) {
  const invoices = subscription.invoices
  const [selectedInvoice, setSelectedInvoice] =
    React.useState<SubscriptionInvoice | null>(null)

  return (
    <>
      <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Invoices</h2>
          <p className="text-xs text-muted-foreground">
            Billing transactions for this subscription contract.
          </p>
        </div>

        {invoices.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No invoices found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Invoice ID</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Interval</th>
                  <th className="px-4 py-2.5 font-medium">Period Covered</th>
                  <th className="px-4 py-2.5 font-medium">Billed for</th>
                  <th className="px-4 py-2.5 font-medium">Payment Method</th>
                  <th className="px-4 py-2.5 font-medium">Users</th>
                  <th className="px-4 py-2.5 font-medium">Branches</th>
                  <th className="px-4 py-2.5 font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.invoiceId} className="border-b last:border-0">
                    <td className="px-4 py-2.5 font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatLongDate(invoice.issueDate)}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {billingIntervalLabels[invoiceInterval(invoice, subscription)]}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatLongDate(invoice.periodStart)} –{" "}
                      {formatLongDate(invoice.periodEnd)}
                    </td>
                    <td className="px-4 py-2.5">
                      <BilledForCell invoice={invoice} />
                    </td>
                    <td className="px-4 py-2.5">
                      <PaymentMethodCell method={invoice.paymentMethod} />
                    </td>
                    <td className="px-4 py-2.5">
                      <QuantityCell value={paidUsersCount(invoice)} />
                    </td>
                    <td className="px-4 py-2.5">
                      <QuantityCell value={paidBranchesCount(invoice)} />
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={invoiceStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`View ${invoice.invoiceNumber}`}
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <EyeIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Download invoice ${invoice.invoiceNumber}`}
                          nativeButton={false}
                          render={
                            <a
                              href={invoiceDownloadHref(invoice)}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                        >
                          <FileTextIcon />
                        </Button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedInvoice && (
        <InvoiceDetailSheet
          invoice={selectedInvoice}
          subscription={subscription}
          open={!!selectedInvoice}
          onOpenChange={(open) => {
            if (!open) setSelectedInvoice(null)
          }}
        />
      )}
    </>
  )
}
