export type PlanId = "delite" | "free_trial" | "standard"
export type PaymentPeriod =
  | "monthly"
  | "quarterly"
  | "half_yearly"
  | "annually"
export type PaymentMethodId = "esewa" | "fonepay"
export type AdditionalModuleId = "e_billings" | "cdxe"

/** `true` / `false` for include, or a short note like "Up to 2" */
export type PlanFeatureValue = boolean | string

export type PlanFeature = {
  id: string
  name: string
  description?: string
  values: Record<PlanId, PlanFeatureValue>
}

export type PlanFeatureCategory = {
  id: string
  name: string
  features: PlanFeature[]
}

export type PlanDefinition = {
  id: PlanId
  name: string
  description: string
  /** Base price per user per month in NPR */
  monthlyPerUser: number
  includes: string[]
}

export const PLANS: PlanDefinition[] = [
  {
    id: "delite",
    name: "Delite Account",
    description: "Essentials for growing teams",
    monthlyPerUser: 699,
    includes: ["Inventory", "Purchase", "Sales", "Accounting"],
  },
  {
    id: "free_trial",
    name: "Free Trial",
    description: "14 days · full access",
    monthlyPerUser: 0,
    includes: ["Inventory", "Purchase", "Sales", "Accounting"],
  },
  {
    id: "standard",
    name: "Standard Plan",
    description: "Advanced tools & support",
    monthlyPerUser: 1499,
    includes: ["Inventory", "Purchase", "Sales", "Accounting"],
  },
]

/** Feature matrix shown in the plan comparison dialog */
export const PLAN_FEATURE_CATEGORIES: PlanFeatureCategory[] = [
  {
    id: "inventory",
    name: "Inventory",
    features: [
      {
        id: "products",
        name: "Product & stock management",
        description: "Track products, stock levels, and adjustments.",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "categories",
        name: "Product categories & units",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "multi-warehouse",
        name: "Multi-warehouse stock",
        description: "Manage inventory across multiple warehouses.",
        values: { delite: false, free_trial: true, standard: true },
      },
      {
        id: "stock-alerts",
        name: "Low-stock alerts",
        values: { delite: "Basic", free_trial: true, standard: true },
      },
    ],
  },
  {
    id: "purchase",
    name: "Purchase",
    features: [
      {
        id: "purchase-orders",
        name: "Purchase orders & requisitions",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "purchase-returns",
        name: "Purchase returns",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "supplier-payments",
        name: "Supplier payments tracking",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "expense",
        name: "Expense management",
        values: { delite: false, free_trial: true, standard: true },
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    features: [
      {
        id: "quotations",
        name: "Quotations & sales orders",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "delivery-notes",
        name: "Delivery notes",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "sales-returns",
        name: "Sales returns",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "customer-payments",
        name: "Customer payment tracking",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "document-templates",
        name: "Custom document templates",
        description: "Brand invoices, quotations, and delivery notes.",
        values: { delite: false, free_trial: true, standard: true },
      },
    ],
  },
  {
    id: "accounting",
    name: "Accounting",
    features: [
      {
        id: "chart-of-accounts",
        name: "Chart of accounts",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "bank-accounts",
        name: "Bank accounts & cheques",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "multi-currency",
        name: "Multiple currencies",
        description: "Record and report in more than one currency.",
        values: { delite: false, free_trial: true, standard: true },
      },
      {
        id: "reports",
        name: "Financial reports",
        values: { delite: "Basic", free_trial: "Full", standard: "Full" },
      },
    ],
  },
  {
    id: "platform",
    name: "Platform & support",
    features: [
      {
        id: "users",
        name: "Users & permission groups",
        values: { delite: true, free_trial: true, standard: true },
      },
      {
        id: "branches",
        name: "Multi-branch support",
        description: "Add branches as an optional add-on.",
        values: {
          delite: "Add-on",
          free_trial: "Add-on",
          standard: "Add-on",
        },
      },
      {
        id: "support",
        name: "Priority support",
        values: { delite: false, free_trial: true, standard: true },
      },
      {
        id: "trial",
        name: "14-day free trial",
        values: { delite: false, free_trial: true, standard: false },
      },
    ],
  },
]

export const DEFAULT_PLAN_ID: PlanId = "free_trial"

/** Extra branch add-on price per month (NPR) */
export const BRANCH_MONTHLY_PRICE = 199

/** VAT rate (13%) */
export const VAT_RATE = 0.13

/** Months billed per payment period (annually = 10× for 2 months free) */
export const PERIOD_MONTH_MULTIPLIER: Record<PaymentPeriod, number> = {
  monthly: 1,
  quarterly: 3,
  half_yearly: 6,
  annually: 10,
}

export const PAYMENT_PERIODS: {
  id: PaymentPeriod
  label: string
}[] = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "half_yearly", label: "Half yearly" },
  { id: "annually", label: "Annually" },
]

export const PAYMENT_METHODS: {
  id: PaymentMethodId
  name: string
  description: string
  logoSrc: string
}[] = [
  {
    id: "esewa",
    name: "eSewa",
    description: "Pay with your eSewa wallet",
    logoSrc: "/images/payment/esewa.png",
  },
  {
    id: "fonepay",
    name: "Fonepay",
    description: "Pay via Fonepay QR / wallet",
    logoSrc: "/images/payment/fonepay.png",
  },
]

export type AdditionalModule = {
  id: AdditionalModuleId
  name: string
  /** Price per month in NPR */
  monthlyPrice: number
}

export const ADDITIONAL_MODULES: AdditionalModule[] = [
  {
    id: "e_billings",
    name: "E-billings",
    monthlyPrice: 99,
  },
  {
    id: "cdxe",
    name: "CDXE",
    monthlyPrice: 99,
  },
]

export type PricingInput = {
  planId: PlanId
  users: number
  period: PaymentPeriod
  branchesEnabled: boolean
  branchCount: number
  moduleIds?: AdditionalModuleId[]
}

export type ModuleLineItem = {
  id: AdditionalModuleId
  name: string
  amount: number
}

export type PricingBreakdown = {
  planName: string
  periodLabel: string
  planSubtotal: number
  branchesSubtotal: number
  modulesSubtotal: number
  moduleLines: ModuleLineItem[]
  subtotal: number
  tax: number
  total: number
  isFree: boolean
}

export function getPlan(planId: PlanId): PlanDefinition {
  return PLANS.find((p) => p.id === planId) ?? PLANS[1]
}

export function getPeriodLabel(period: PaymentPeriod): string {
  return (
    PAYMENT_PERIODS.find((p) => p.id === period)?.label.toLowerCase() ?? period
  )
}

export function calculatePricing(input: PricingInput): PricingBreakdown {
  const plan = getPlan(input.planId)
  const users = Math.max(1, input.users)
  const periodMultiplier = PERIOD_MONTH_MULTIPLIER[input.period] ?? 1
  const periodLabel = getPeriodLabel(input.period)
  const selectedModuleIds = new Set(input.moduleIds ?? [])

  const planSubtotal = plan.monthlyPerUser * users * periodMultiplier

  const branchesSubtotal =
    input.branchesEnabled && input.branchCount > 0
      ? BRANCH_MONTHLY_PRICE * Math.max(1, input.branchCount) * periodMultiplier
      : 0

  const moduleLines: ModuleLineItem[] = ADDITIONAL_MODULES.filter((mod) =>
    selectedModuleIds.has(mod.id)
  ).map((mod) => ({
    id: mod.id,
    name: mod.name,
    amount: mod.monthlyPrice * periodMultiplier,
  }))

  const modulesSubtotal = moduleLines.reduce((sum, line) => sum + line.amount, 0)

  const subtotal = planSubtotal + branchesSubtotal + modulesSubtotal
  const tax = Math.round(subtotal * VAT_RATE * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  return {
    planName: plan.name,
    periodLabel,
    planSubtotal,
    branchesSubtotal,
    modulesSubtotal,
    moduleLines,
    subtotal,
    tax,
    total,
    isFree: total <= 0,
  }
}

export function formatNpr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-NP", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}
