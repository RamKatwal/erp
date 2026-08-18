"use client"

import * as React from "react"
import Image from "next/image"
import { DownloadIcon, EyeIcon, FileTextIcon } from "lucide-react"

import {
  branchAvatarItems,
  StackedAvatars,
  userAvatarItems,
} from "@/components/admin/subscriptions/stacked-avatars"
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
import {
  invoiceReceiptPath,
} from "@/lib/mock/invoice-receipt"
import {
  paymentProviderLabels,
  type Subscription,
  type SubscriptionInvoice,
  type SubscriptionPaymentMethod,
} from "@/types/subscription"

const providerLogos = {
  esewa: "/images/payment/esewa.png",
  fonepay: "/images/payment/fonepay.png",
} as const

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
        <Image
          src={providerLogos[method.provider]}
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
  open,
  onOpenChange,
}: {
  invoice: SubscriptionInvoice
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const pdfHref = invoiceDownloadHref(invoice)
  const isPaid = invoice.status === "Paid"

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
            <DetailRow label="Plan">
              {invoice.planName}
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
            Usage
          </h3>
          <div className="text-sm">
            <DetailRow label="Users">
              {invoice.usersUsed} / {invoice.usersLimit}
            </DetailRow>
            <DetailRow label="Branches">
              {invoice.branchesUsed} / {invoice.branchesLimit}
            </DetailRow>
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
            Download receipt
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
                  <th className="px-4 py-2.5 font-medium">Period Covered</th>
                  <th className="px-4 py-2.5 font-medium">Plan type</th>
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
                      {formatLongDate(invoice.periodStart)} –{" "}
                      {formatLongDate(invoice.periodEnd)}
                    </td>
                    <td className="px-4 py-2.5">{invoice.planName}</td>
                    <td className="px-4 py-2.5">
                      <PaymentMethodCell method={invoice.paymentMethod} />
                    </td>
                    <td className="px-4 py-2.5">
                      <StackedAvatars
                        items={userAvatarItems(
                          subscription.members,
                          invoice.usersUsed
                        )}
                        total={invoice.usersUsed}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <StackedAvatars
                        items={branchAvatarItems(
                          subscription.assignedBranches.slice(
                            0,
                            invoice.branchesUsed
                          )
                        )}
                        total={invoice.branchesUsed}
                      />
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
                          aria-label={`Download ${invoice.invoiceNumber}`}
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
          open={!!selectedInvoice}
          onOpenChange={(open) => {
            if (!open) setSelectedInvoice(null)
          }}
        />
      )}
    </>
  )
}
