export const SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "pending",
  "past_due",
  "canceled",
] as const

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

export const BILLING_INTERVALS = ["month", "year"] as const

export type BillingInterval = (typeof BILLING_INTERVALS)[number]

export const INVOICE_STATUSES = ["Paid", "Open", "Past due", "Void"] as const

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export type SubscriptionAssignedBranch = {
  branchId: string
  branchName: string
  branchCode: string
  status: "Active" | "Inactive"
}

export type SubscriptionPaymentMethod = {
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  billingEmail: string
}

export type SubscriptionInvoice = {
  invoiceId: string
  invoiceNumber: string
  issueDate: string
  periodStart: string
  periodEnd: string
  amountPaid: number
  currency: string
  status: InvoiceStatus
  pdfDownloadUrl: string
}

export type Subscription = {
  id: string
  companyId: string
  companyName: string
  planId: string
  planName: string
  planTier: string
  planDescription: string
  isTrial: boolean
  status: SubscriptionStatus
  branchesUsed: number
  branchesLimit: number
  usersUsed: number
  usersLimit: number
  amount: number
  currency: string
  interval: BillingInterval
  createdAt: string
  periodEnd: string
  nextBillingDate: string
  remainingDays: number
  autoRenew: boolean
  paymentMethod: SubscriptionPaymentMethod | null
  features: string[]
  assignedBranches: SubscriptionAssignedBranch[]
  invoices: SubscriptionInvoice[]
}

export const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  active: "Active",
  trialing: "Trial",
  pending: "Pending",
  past_due: "Past due",
  canceled: "Canceled",
}

export const billingIntervalLabels: Record<BillingInterval, string> = {
  month: "Monthly",
  year: "Annual",
}

export function formatPaymentMethodSummary(
  method: SubscriptionPaymentMethod | null
): string {
  if (!method) return "—"
  return `${method.brand} •••• ${method.last4}`
}
