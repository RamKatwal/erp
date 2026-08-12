import {
  PLANS,
  type AdditionalModuleId,
  type PaymentMethodId,
  type PaymentPeriod,
  type PlanId,
} from "@/lib/onboarding/plans"
import type { OnboardingPlanSelection } from "@/lib/onboarding/storage"
import type { OnboardingEntitlement } from "@/lib/onboarding/session-types"
import type { BillingInterval, Subscription } from "@/types/subscription"

export const ENTITLEMENT_STORAGE_KEY = "providhy_entitlement"
export const WORKSPACE_SUBSCRIPTION_STORAGE_KEY = "providhy_workspace_subscription"

export function buildEntitlementFromPlan(
  plan: OnboardingPlanSelection,
  options?: { paymentMethod?: PaymentMethodId | null; subscriptionId?: string }
): OnboardingEntitlement {
  const def = PLANS.find((p) => p.id === plan.planId)
  const isTrial = plan.planId === "free_trial"
  return {
    planId: plan.planId,
    planName: def?.name ?? plan.planId,
    isTrial,
    users: isTrial ? 1 : Math.max(1, plan.users),
    branchCount: isTrial
      ? 1
      : plan.branchesEnabled
        ? Math.max(1, plan.branchCount)
        : 1,
    moduleIds: isTrial ? [] : plan.moduleIds,
    period: plan.period,
    paymentMethod: options?.paymentMethod ?? (isTrial ? null : plan.paymentMethod),
    activatedAt: new Date().toISOString(),
    subscriptionId:
      options?.subscriptionId ??
      `sub_${plan.planId}_${Date.now().toString(36)}`,
  }
}

function periodToInterval(period: PaymentPeriod): BillingInterval {
  return period === "annually" ? "year" : "month"
}

export function entitlementToSubscription(
  entitlement: OnboardingEntitlement,
  company: { id: string; name: string }
): Subscription {
  const activated = new Date(entitlement.activatedAt)
  const periodEnd = new Date(activated)
  if (entitlement.isTrial) {
    periodEnd.setDate(periodEnd.getDate() + 14)
  } else if (entitlement.period === "annually") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  } else if (entitlement.period === "quarterly") {
    periodEnd.setMonth(periodEnd.getMonth() + 3)
  } else if (entitlement.period === "half_yearly") {
    periodEnd.setMonth(periodEnd.getMonth() + 6)
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  }

  const remainingDays = Math.max(
    0,
    Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  const planDef = PLANS.find((p) => p.id === entitlement.planId)

  return {
    id: entitlement.subscriptionId,
    companyId: company.id,
    companyName: company.name,
    planId: entitlement.planId,
    planName: entitlement.planName,
    planTier: entitlement.planName,
    planDescription: planDef?.description ?? "",
    isTrial: entitlement.isTrial,
    status: entitlement.isTrial ? "trialing" : "active",
    branchesUsed: 0,
    branchesLimit: entitlement.branchCount,
    usersUsed: 1,
    usersLimit: entitlement.users,
    amount: 0,
    currency: "NPR",
    interval: periodToInterval(entitlement.period),
    createdAt: entitlement.activatedAt.slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    nextBillingDate: periodEnd.toISOString().slice(0, 10),
    remainingDays,
    autoRenew: !entitlement.isTrial,
    paymentMethod: entitlement.paymentMethod
      ? {
          brand: entitlement.paymentMethod === "esewa" ? "eSewa" : "Fonepay",
          last4: "0000",
          expiryMonth: 12,
          expiryYear: periodEnd.getFullYear() + 1,
          billingEmail: "",
        }
      : null,
    features: planDef?.includes ?? [],
    assignedBranches: [],
    invoices: entitlement.isTrial
      ? []
      : [
          {
            invoiceId: `inv_${entitlement.subscriptionId}`,
            invoiceNumber: `INV-${entitlement.subscriptionId.slice(-6).toUpperCase()}`,
            issueDate: entitlement.activatedAt.slice(0, 10),
            periodStart: entitlement.activatedAt.slice(0, 10),
            periodEnd: periodEnd.toISOString().slice(0, 10),
            amountPaid: 0,
            currency: "NPR",
            status: "Paid",
            pdfDownloadUrl: "#",
          },
        ],
  }
}

/** Client-side durable entitlement cache (survives onboarding draft clear). */
export function saveEntitlementClient(entitlement: OnboardingEntitlement): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      ENTITLEMENT_STORAGE_KEY,
      JSON.stringify(entitlement)
    )
  } catch {
    // ignore
  }
}

export function loadEntitlementClient(): OnboardingEntitlement | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(ENTITLEMENT_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OnboardingEntitlement
  } catch {
    return null
  }
}

export function saveWorkspaceSubscriptionClient(sub: Subscription): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      WORKSPACE_SUBSCRIPTION_STORAGE_KEY,
      JSON.stringify(sub)
    )
  } catch {
    // ignore
  }
}

export function loadWorkspaceSubscriptionClient(): Subscription | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(WORKSPACE_SUBSCRIPTION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Subscription
  } catch {
    return null
  }
}

export function upgradeEntitlementPlan(
  current: OnboardingEntitlement,
  next: {
    planId: PlanId
    users: number
    period: PaymentPeriod
    branchCount: number
    moduleIds: AdditionalModuleId[]
    paymentMethod: PaymentMethodId
  }
): OnboardingEntitlement {
  const def = PLANS.find((p) => p.id === next.planId)
  return {
    ...current,
    planId: next.planId,
    planName: def?.name ?? next.planId,
    isTrial: false,
    users: Math.max(1, next.users),
    branchCount: Math.max(1, next.branchCount),
    moduleIds: next.moduleIds,
    period: next.period,
    paymentMethod: next.paymentMethod,
    activatedAt: new Date().toISOString(),
    // Keep same subscription id for idempotent upgrade
    subscriptionId: current.subscriptionId,
  }
}
