"use client"

import { FileTextIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/format"
import type { SubscriptionInvoice } from "@/types/subscription"

type InvoicesSectionProps = {
  invoices: SubscriptionInvoice[]
}

export function InvoicesSection({ invoices }: InvoicesSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Invoices & history</h2>
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
          <table className="w-full min-w-[720px] text-sm">
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
              {invoices.map((invoice) => (
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
  )
}
