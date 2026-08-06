export const ONBOARDING_COMPANY_STORAGE_KEY = "providhy_onboarding_company"

export type OnboardingCompanyDraft = {
  companyName: string
  email: string
  contact: string
  pan: string
  registeredWithVat: boolean
  industryType: string
  province: string
  district: string
  fullAddress: string
  companyWebsite?: string
  employeeNumber?: string
}

export function saveCompanyDraft(draft: OnboardingCompanyDraft): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(ONBOARDING_COMPANY_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // ignore quota / private mode errors
  }
}

export function loadCompanyDraft(): OnboardingCompanyDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(ONBOARDING_COMPANY_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OnboardingCompanyDraft
  } catch {
    return null
  }
}

export function clearCompanyDraft(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(ONBOARDING_COMPANY_STORAGE_KEY)
  } catch {
    // ignore
  }
}
