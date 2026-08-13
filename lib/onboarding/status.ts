/**
 * Onboarding state machine.
 * Plan/Payment is a standalone entitlement gate (no stepper).
 * After plan_active: setup stepper = Company → Branches.
 * `users_pending` is a legacy status treated as complete.
 */

export const ONBOARDING_STATUSES = [
  "account_verified",
  "plan_pending",
  "payment_pending",
  "plan_active",
  "company_pending",
  "branches_pending",
  "users_pending",
  "complete",
] as const

export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number]

/** Steps shown in the post-payment setup stepper (not Plan). */
export type SetupStepId = "company" | "branches"

export const SETUP_STEPS: { id: SetupStepId; label: string }[] = [
  { id: "company", label: "Company" },
  { id: "branches", label: "Branches" },
]

export function isOnboardingComplete(status: OnboardingStatus): boolean {
  return status === "complete" || status === "users_pending"
}

export function isPlanOrPaymentPath(pathname: string): boolean {
  return (
    pathname.includes("/onboarding/plan") ||
    pathname.includes("/onboarding/payment")
  )
}

export function isSetupPath(pathname: string): boolean {
  return (
    pathname.includes("/onboarding/company") ||
    pathname.includes("/onboarding/branches")
  )
}

/**
 * Setup stepper index: 0=company, 1=branches.
 * Returns -1 for plan/payment (not in stepper).
 */
export function setupStepIndexFromPath(pathname: string): number {
  if (pathname.includes("/branches")) return 1
  if (pathname.includes("/company")) return 0
  return -1
}

/** Highest setup step index the user may open. */
export function maxReachableSetupStepIndex(status: OnboardingStatus): number {
  switch (status) {
    case "plan_active":
    case "company_pending":
      return 0
    case "branches_pending":
      return 1
    case "users_pending":
    case "complete":
      return 1
    default:
      // Before entitlement: no setup steps
      return -1
  }
}

export function isSetupStepComplete(
  status: OnboardingStatus,
  stepIndex: number
): boolean {
  if (isOnboardingComplete(status)) return true
  if (status === "branches_pending") return stepIndex < 1
  return false
}

export function canAccessSetupStep(
  status: OnboardingStatus,
  stepIndex: number
): boolean {
  if (isOnboardingComplete(status)) return true
  const max = maxReachableSetupStepIndex(status)
  if (max < 0) return false
  return stepIndex <= max
}

/** Whether the user may open plan/payment routes. */
export function canAccessPlanFlow(status: OnboardingStatus): boolean {
  return (
    status === "account_verified" ||
    status === "plan_pending" ||
    status === "payment_pending" ||
    // Allow revisiting plan only before setup starts deeply? Prefer lock after active.
    status === "plan_active"
  )
}

/** Canonical resume route for the current status. */
export function resumePathForStatus(
  status: OnboardingStatus,
  email?: string | null
): string {
  const q =
    email && email.trim()
      ? `?email=${encodeURIComponent(email.trim())}`
      : ""

  switch (status) {
    case "account_verified":
    case "plan_pending":
    case "payment_pending":
      return `/onboarding/plan${q}`
    case "plan_active":
    case "company_pending":
      return `/onboarding/company${q}`
    case "branches_pending":
      return `/onboarding/branches${q}`
    case "users_pending":
    case "complete":
      return "/admin"
    default:
      return `/onboarding/plan${q}`
  }
}

export function pathForSetupStep(
  step: SetupStepId,
  email?: string | null
): string {
  const q =
    email && email.trim()
      ? `?email=${encodeURIComponent(email.trim())}`
      : ""
  return `/onboarding/${step}${q}`
}

export function isOnboardingPath(pathname: string): boolean {
  return pathname.startsWith("/onboarding")
}

export function isAppShellPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/purchase") ||
    pathname.startsWith("/sales") ||
    pathname.startsWith("/accounting") ||
    pathname.startsWith("/configurations") ||
    pathname.startsWith("/settings")
  )
}

export function parseOnboardingStatus(
  value: unknown
): OnboardingStatus | null {
  if (
    typeof value === "string" &&
    (ONBOARDING_STATUSES as readonly string[]).includes(value)
  ) {
    return value as OnboardingStatus
  }
  return null
}

/** @deprecated Use setupStepIndexFromPath — kept for gradual migration */
export function stepIndexFromPath(pathname: string): number {
  return setupStepIndexFromPath(pathname)
}

/** @deprecated Use maxReachableSetupStepIndex */
export function maxReachableStepIndex(status: OnboardingStatus): number {
  return Math.max(0, maxReachableSetupStepIndex(status))
}

/** @deprecated Use isSetupStepComplete */
export function isStepComplete(
  status: OnboardingStatus,
  stepIndex: number
): boolean {
  return isSetupStepComplete(status, stepIndex)
}

/** @deprecated Use canAccessSetupStep */
export function canAccessStep(
  status: OnboardingStatus,
  stepIndex: number
): boolean {
  return canAccessSetupStep(status, stepIndex)
}

/** @deprecated Use pathForSetupStep */
export function pathForStep(
  step: "plan" | SetupStepId,
  email?: string | null
): string {
  if (step === "plan") {
    const q =
      email && email.trim()
        ? `?email=${encodeURIComponent(email.trim())}`
        : ""
    return `/onboarding/plan${q}`
  }
  return pathForSetupStep(step, email)
}

export type OnboardingStepId = "plan" | SetupStepId
