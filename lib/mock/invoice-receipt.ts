import { mockSubscriptions } from "@/lib/mock/subscriptions"
import {
  invoiceBilledForLabel,
  paymentProviderLabels,
} from "@/types/subscription"
import type { Subscription, SubscriptionInvoice } from "@/types/subscription"

export type InvoiceReceiptData = {
  invoiceId: string
  invoiceNumber: string
  receiptNumber: string
  datePaid: string
  amountPaid: number
  currency: string
  planName: string
  periodStart: string
  periodEnd: string
  unitPrice: number
  quantity: number
  subtotal: number
  discount?: {
    label: string
    amount: number
  }
  billTo: {
    companyName: string
    address: string
    email: string
  }
  paymentMethod: string | null
  paymentHistory: Array<{
    method: string
    date: string
    amountPaid: number
    invoiceNumber: string
  }>
}

export function invoiceReceiptPath(invoiceId: string) {
  return `/inv_demo/${invoiceId}`
}

export function findInvoiceContext(invoiceId: string): {
  subscription: Subscription
  invoice: SubscriptionInvoice
} | null {
  for (const subscription of mockSubscriptions) {
    const invoice = subscription.invoices.find(
      (item) => item.invoiceId === invoiceId
    )
    if (invoice) {
      return { subscription, invoice }
    }
  }
  return null
}

function receiptNumberFromInvoiceId(invoiceId: string) {
  const digits = invoiceId.replace(/\D/g, "")
  if (digits.length >= 4) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8).padEnd(4, "0")}`
  }
  return "0000-0001"
}

export function buildInvoiceReceiptData(
  subscription: Subscription,
  invoice: SubscriptionInvoice
): InvoiceReceiptData {
  const receiptNumber = receiptNumberFromInvoiceId(invoice.invoiceId)
  const paymentMethod = invoice.paymentMethod
    ? paymentProviderLabels[invoice.paymentMethod.provider]
    : null

  return {
    invoiceId: invoice.invoiceId,
    invoiceNumber: invoice.invoiceNumber,
    receiptNumber,
    datePaid: invoice.issueDate,
    amountPaid: invoice.amountPaid,
    currency: invoice.currency,
    planName: invoiceBilledForLabel(invoice),
    periodStart: invoice.periodStart,
    periodEnd: invoice.periodEnd,
    unitPrice: invoice.amountPaid,
    quantity: 1,
    subtotal: invoice.amountPaid,
    billTo: {
      companyName: subscription.companyName,
      address: "Kathmandu, Bagmati, Nepal",
      email:
        invoice.paymentMethod?.billingEmail ??
        subscription.paymentMethod?.billingEmail ??
        "billing@company.com",
    },
    paymentMethod,
    paymentHistory:
      invoice.status === "Paid" && paymentMethod
        ? [
            {
              method: paymentMethod,
              date: invoice.issueDate,
              amountPaid: invoice.amountPaid,
              invoiceNumber: invoice.invoiceNumber,
            },
          ]
        : [],
  }
}

export function getInvoiceReceiptById(
  invoiceId: string
): InvoiceReceiptData | null {
  const context = findInvoiceContext(invoiceId)
  if (context) {
    return buildInvoiceReceiptData(context.subscription, context.invoice)
  }

  const subscriptionMatch = invoiceId.match(/^inv_(SUB-\d+)_/)
  if (!subscriptionMatch) return null

  const subscription = mockSubscriptions.find(
    (item) => item.id === subscriptionMatch[1]
  )
  if (!subscription) return null

  const today = new Date().toISOString().slice(0, 10)

  return buildInvoiceReceiptData(subscription, {
    invoiceId,
    invoiceNumber: `INV-${subscription.id.slice(-5)}`,
    issueDate: today,
    periodStart: today,
    periodEnd: subscription.periodEnd,
    amountPaid: subscription.amount,
    currency: subscription.currency,
    status: "Paid",
    pdfDownloadUrl: invoiceReceiptPath(invoiceId),
    planName: subscription.planName,
    chargeType: "plan",
    paymentMethod: subscription.paymentMethod,
    usersUsed: subscription.usersUsed,
    usersLimit: subscription.usersLimit,
    branchesUsed: subscription.branchesUsed,
    branchesLimit: subscription.branchesLimit,
  })
}

export const defaultDemoInvoiceId = "inv_2026_001"
