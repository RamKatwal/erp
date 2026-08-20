import type { OnboardingCompanyDraft } from "@/lib/onboarding/company-storage"

export type CompanyProfile = OnboardingCompanyDraft & {
  id: string
  /** Website domain for favicon logos (e.g. stripe.com). */
  domain?: string | null
  logoUrl?: string | null
}
