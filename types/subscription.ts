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

export const SUBSCRIPTION_PAYMENT_PROVIDERS = ["esewa", "fonepay"] as const

export type SubscriptionPaymentProvider =
  (typeof SUBSCRIPTION_PAYMENT_PROVIDERS)[number]

export type SubscriptionAssignedBranch = {
  branchId: string
  branchName: string
  branchCode: string
  status: "Active" | "Inactive"
}

export type SubscriptionMember = {
  id: string
  name: string
  initials: string
}

export type SubscriptionPaymentMethod = {
  provider: SubscriptionPaymentProvider
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
  planName: string
  paymentMethod: SubscriptionPaymentMethod | null
  usersUsed: number
  usersLimit: number
  branchesUsed: number
  branchesLimit: number
}

export type Subscription = {
  id: string
  companyId: string
  companyName: string
  /** Company website domain for Google favicon logos (e.g. stripe.com). */
  companyDomain?: string | null
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
  members: SubscriptionMember[]
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

export const billingIntervalUnits: Record<BillingInterval, string> = {
  month: "Month",
  year: "Year",
}

export const paymentProviderLabels: Record<
  SubscriptionPaymentProvider,
  string
> = {
  esewa: "eSewa",
  fonepay: "Fonepay",
}

export function formatPaymentMethodSummary(
  method: SubscriptionPaymentMethod | null
): string {
  if (!method) return "—"
  return paymentProviderLabels[method.provider]
}
