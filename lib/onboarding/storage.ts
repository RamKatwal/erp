import type {
  AdditionalModuleId,
  PaymentMethodId,
  PaymentPeriod,
  PlanId,
} from "@/lib/onboarding/plans"
import {
  ADDITIONAL_MODULES,
  DEFAULT_PLAN_ID,
  PAYMENT_PERIODS,
} from "@/lib/onboarding/plans"

export const ONBOARDING_PLAN_STORAGE_KEY = "providhy_onboarding_plan"

export type OnboardingPlanSelection = {
  planId: PlanId
  users: number
  period: PaymentPeriod
  branchesEnabled: boolean
  branchCount: number
  moduleIds: AdditionalModuleId[]
  paymentMethod: PaymentMethodId | null
}

export const DEFAULT_PLAN_SELECTION: OnboardingPlanSelection = {
  planId: DEFAULT_PLAN_ID,
  users: 1,
  period: "monthly",
  branchesEnabled: false,
  branchCount: 1,
  moduleIds: [],
  paymentMethod: null,
}

const VALID_MODULES = new Set<string>(ADDITIONAL_MODULES.map((m) => m.id))

function normalizeModuleIds(moduleIds: unknown): AdditionalModuleId[] {
  if (!Array.isArray(moduleIds)) return []
  return moduleIds.filter(
    (id): id is AdditionalModuleId =>
      typeof id === "string" && VALID_MODULES.has(id)
  )
}

const VALID_PERIODS = new Set<string>(PAYMENT_PERIODS.map((p) => p.id))

function normalizePeriod(period: unknown): PaymentPeriod {
  if (period === "yearly") return "annually"
  if (typeof period === "string" && VALID_PERIODS.has(period)) {
    return period as PaymentPeriod
  }
  return DEFAULT_PLAN_SELECTION.period
}

export function savePlanSelection(selection: OnboardingPlanSelection): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(
      ONBOARDING_PLAN_STORAGE_KEY,
      JSON.stringify(selection)
    )
  } catch {
    // ignore quota / private mode errors
  }
}

export function loadPlanSelection(): OnboardingPlanSelection | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(ONBOARDING_PLAN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<OnboardingPlanSelection>
    return {
      ...DEFAULT_PLAN_SELECTION,
      ...parsed,
      period: normalizePeriod(parsed.period),
      moduleIds: normalizeModuleIds(parsed.moduleIds),
    }
  } catch {
    return null
  }
}

export function clearPlanSelection(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(ONBOARDING_PLAN_STORAGE_KEY)
  } catch {
    // ignore
  }
}
