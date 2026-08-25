import {
  homeOrganizations,
  type HomeOrganization,
} from "@/lib/admin/home-organizations"
import { getMockCompanyProfile } from "@/lib/mock/companies"
import type { SubscriptionStatus } from "@/types/subscription"

export const SETUP_STEP_IDS = [
  "company_profile",
  "branch_setup",
  "warehouse_setup",
  "chart_of_accounts",
  "user_roles",
  "opening_balances",
  "tax_configuration",
  "payment_billing",
] as const

export type SetupStepId = (typeof SETUP_STEP_IDS)[number]

export type SetupUrgency = "danger" | "warning" | "neutral"

export type SetupStepDefinition = {
  id: SetupStepId
  title: string
  description: string
}

export const SETUP_STEPS: SetupStepDefinition[] = [
  {
    id: "company_profile",
    title: "Company profile",
    description: "Legal name, PAN/tax ID, fiscal year, and currency.",
  },
  {
    id: "branch_setup",
    title: "Branch setup",
    description: "Add at least one branch for this organization.",
  },
  {
    id: "warehouse_setup",
    title: "Warehouse setup",
    description: "Create a default warehouse for each branch.",
  },
  {
    id: "chart_of_accounts",
    title: "Chart of accounts",
    description: "Use the default template or customize the ledger.",
  },
  {
    id: "user_roles",
    title: "User roles & permissions",
    description: "Invite at least one user beyond the organization admin.",
  },
  {
    id: "opening_balances",
    title: "Opening balances",
    description: "Enter inventory, cash, bank, receivables, and payables.",
  },
  {
    id: "tax_configuration",
    title: "Tax configuration",
    description: "Set VAT/GST rates and registration numbers.",
  },
  {
    id: "payment_billing",
    title: "Payment & billing setup",
    description: "Confirm the subscription plan and a valid payment method.",
  },
]

export const SETUP_STEP_COUNT = SETUP_STEPS.length

type SetupFlags = {
  warehouse: boolean
  chartOfAccounts: boolean
  openingBalances: boolean
  tax: boolean
}

/** Mock extras that are not already on the subscription record. */
const setupFlagsByCompanyId: Record<string, SetupFlags> = {
  comp_10294: {
    warehouse: true,
    chartOfAccounts: true,
    openingBalances: true,
    tax: true,
  },
  comp_10881: {
    warehouse: true,
    chartOfAccounts: true,
    openingBalances: false,
    tax: false,
  },
  comp_11002: {
    warehouse: true,
    chartOfAccounts: true,
    openingBalances: true,
    tax: true,
  },
  comp_11140: {
    warehouse: false,
    chartOfAccounts: false,
    openingBalances: false,
    tax: false,
  },
}

export type ResolvedSetupStep = SetupStepDefinition & {
  complete: boolean
  blocking: boolean
  locked: boolean
  href: string
}

export type OrganizationSetupProgress = {
  org: HomeOrganization
  steps: ResolvedSetupStep[]
  completedCount: number
  percent: number
  urgency: SetupUrgency
  previewSteps: ResolvedSetupStep[]
}

function setupHref(stepId: SetupStepId, org: HomeOrganization): string {
  switch (stepId) {
    case "company_profile":
      return `/admin/companies/${org.companyId}/configuration`
    case "branch_setup":
      return "/admin/organizations/branch-management"
    case "warehouse_setup":
      return "/inventory"
    case "chart_of_accounts":
      return "/accounting/chart-of-accounts"
    case "user_roles":
      return "/admin/settings/users-permissions/users"
    case "opening_balances":
      return "/accounting"
    case "tax_configuration":
      return "/configurations/general/company-configuration"
    case "payment_billing":
      return `/admin/subscriptions/${org.id}`
  }
}

function isCompanyProfileComplete(companyId: string): boolean {
  const profile = getMockCompanyProfile(companyId)
  if (!profile) return false
  return Boolean(profile.companyName && profile.pan)
}

function isPaymentComplete(org: HomeOrganization): boolean {
  if (org.status === "past_due" || org.status === "pending") return false
  if (org.status === "trialing" || org.isTrial) return false
  return Boolean(org.paymentMethod)
}

function isPaymentBlocking(status: SubscriptionStatus): boolean {
  return status === "past_due"
}

function resolveStepComplete(
  stepId: SetupStepId,
  org: HomeOrganization,
  flags: SetupFlags,
  chartOfAccountsComplete: boolean
): boolean {
  switch (stepId) {
    case "company_profile":
      return isCompanyProfileComplete(org.companyId)
    case "branch_setup":
      return org.branchesUsed > 0
    case "warehouse_setup":
      return flags.warehouse
    case "chart_of_accounts":
      return flags.chartOfAccounts
    case "user_roles":
      return org.usersUsed > 1
    case "opening_balances":
      return chartOfAccountsComplete && flags.openingBalances
    case "tax_configuration":
      return flags.tax
    case "payment_billing":
      return isPaymentComplete(org)
  }
}

export function setupUrgencyForStatus(status: SubscriptionStatus): SetupUrgency {
  if (status === "past_due") return "danger"
  if (status === "pending") return "warning"
  return "neutral"
}

function previewSteps(steps: ResolvedSetupStep[]): ResolvedSetupStep[] {
  const incomplete = steps.filter((step) => !step.complete)
  return incomplete.slice(0, 2)
}

export function getOrganizationSetupProgress(
  org: HomeOrganization
): OrganizationSetupProgress {
  const flags = setupFlagsByCompanyId[org.companyId] ?? {
    warehouse: false,
    chartOfAccounts: false,
    openingBalances: false,
    tax: false,
  }
  const chartOfAccountsComplete = flags.chartOfAccounts

  const steps: ResolvedSetupStep[] = SETUP_STEPS.map((definition) => {
    const complete = resolveStepComplete(
      definition.id,
      org,
      flags,
      chartOfAccountsComplete
    )
    const blocking =
      definition.id === "payment_billing" && isPaymentBlocking(org.status)
    const locked =
      definition.id === "opening_balances" && !chartOfAccountsComplete
    const href =
      locked
        ? setupHref("chart_of_accounts", org)
        : setupHref(definition.id, org)

    return {
      ...definition,
      complete,
      blocking,
      locked,
      href,
    }
  })

  const completedCount = steps.filter((step) => step.complete).length

  return {
    org,
    steps,
    completedCount,
    percent: Math.round((completedCount / SETUP_STEP_COUNT) * 100),
    urgency: setupUrgencyForStatus(org.status),
    previewSteps: previewSteps(steps),
  }
}

export function getIncompleteOrganizationSetups(): OrganizationSetupProgress[] {
  return homeOrganizations
    .map(getOrganizationSetupProgress)
    .filter((progress) => progress.completedCount < SETUP_STEP_COUNT)
}

export function getOrganizationSetupByCompanyId(
  companyId: string
): OrganizationSetupProgress | undefined {
  const org = homeOrganizations.find((item) => item.companyId === companyId)
  if (!org) return undefined
  return getOrganizationSetupProgress(org)
}
