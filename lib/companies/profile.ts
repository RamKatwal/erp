import { loadCompanyDraft } from "@/lib/onboarding/company-storage"
import { getMockCompanyProfile, mockCompanyProfiles } from "@/lib/mock/companies"
import type { CompanyProfile } from "@/types/company"

const STORAGE_PREFIX = "providhy_company_profile_"

function storageKey(companyId: string) {
  return `${STORAGE_PREFIX}${companyId}`
}

export function getDefaultCompanyId(): string {
  const draft = loadCompanyDraft()
  if (draft?.pan) {
    const fromPan = `comp_${draft.pan}`
    if (getMockCompanyProfile(fromPan)) return fromPan
  }
  return mockCompanyProfiles[0]?.id ?? "comp_10294"
}

export function readCompanyProfile(companyId: string): CompanyProfile | undefined {
  const base = getMockCompanyProfile(companyId)
  if (!base) return undefined

  if (typeof window === "undefined") return base

  try {
    const raw = window.localStorage.getItem(storageKey(companyId))
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<CompanyProfile>
    return { ...base, ...saved, id: companyId }
  } catch {
    return base
  }
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  if (typeof window === "undefined") return

  try {
    const { id, ...draft } = profile
    window.localStorage.setItem(storageKey(id), JSON.stringify(draft))
  } catch {
    // ignore quota / private mode errors
  }
}

export function getCurrentCompanyProfile(): CompanyProfile | undefined {
  return readCompanyProfile(getDefaultCompanyId())
}
