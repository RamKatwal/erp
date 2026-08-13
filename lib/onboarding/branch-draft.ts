import type { OnboardingCompanyDraft } from "@/lib/onboarding/company-storage"

export type QuickBranchRow = {
  id: string
  name: string
  code: string
  location: string
  contactNumber: string
  contactEmail: string
  /** When true, code follows company prefix + location + sequence. */
  codeAuto: boolean
}

const SKIP_WORDS = new Set([
  "pvt",
  "ltd",
  "llc",
  "inc",
  "co",
  "the",
  "and",
  "of",
  "company",
  "private",
  "limited",
])

/** Company prefix for branch codes, e.g. "Kathmandu Traders Ltd" → "KTL". */
export function companyCodePrefix(companyName: string): string {
  const words = companyName
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !SKIP_WORDS.has(w.toLowerCase()))

  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((w) => w[0]!.toUpperCase())
      .join("")
      .padEnd(3, "X")
      .slice(0, 3)
  }

  const compact = companyName.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (!compact) return "BRN"
  return compact.slice(0, 3).padEnd(3, "X")
}

/** Location segment, e.g. Kathmandu → KTM (first letter + consonants). */
export function locationCode(location: string): string {
  const token = (
    location.trim().split(/[,\s/]+/).filter(Boolean)[0] ?? ""
  )
    .toUpperCase()
    .replace(/[^A-Z]/g, "")

  if (!token) return "XXX"

  // Prefer airport-style: first letter + consonants (skip soft H).
  // Kathmandu → KTM, Pokhara → PKR
  const rest = token.slice(1).replace(/[AEIOUH]/g, "")
  const code = `${token[0]}${rest}`.slice(0, 3)
  if (code.length >= 3) return code
  return token.slice(0, 3).padEnd(3, "X")
}

/** Auto code: `{companyPrefix}-{location}-{seq}` → KTL-KTM-01 */
export function generateBranchCode(
  companyPrefix: string,
  location: string,
  index: number
): string {
  const prefix = (companyPrefix || "BRN").toUpperCase().slice(0, 3)
  const loc = location.trim() ? locationCode(location) : "XXX"
  const seq = String(index + 1).padStart(2, "0")
  return `${prefix}-${loc}-${seq}`
}

export function defaultBranchName(index: number): string {
  if (index === 0) return "Head Office"
  return `Branch-${index}`
}

export function createDraftRowId() {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function createEmptyBranchRow(
  index: number,
  companyPrefix: string,
  opts?: Partial<QuickBranchRow>
): QuickBranchRow {
  const name = opts?.name ?? defaultBranchName(index)
  const location = opts?.location ?? ""
  return {
    id: opts?.id ?? createDraftRowId(),
    name,
    location,
    contactNumber: opts?.contactNumber ?? "",
    contactEmail: opts?.contactEmail ?? "",
    codeAuto: opts?.codeAuto ?? true,
    code:
      opts?.code ??
      generateBranchCode(companyPrefix, location, index),
  }
}

/** Recompute auto codes after insert/remove/reorder so sequences stay unique. */
export function resequenceBranchCodes(
  rows: QuickBranchRow[],
  companyPrefix: string
): QuickBranchRow[] {
  return rows.map((row, index) => {
    if (!row.codeAuto) return row
    return {
      ...row,
      code: generateBranchCode(companyPrefix, row.location, index),
    }
  })
}

export function headOfficeLocationFromCompany(
  company: OnboardingCompanyDraft | null
): string {
  if (!company) return ""
  return [company.district || company.fullAddress, company.province]
    .filter(Boolean)
    .join(", ")
}

export function buildDefaultBranchRows(
  count: number,
  company: OnboardingCompanyDraft | null
): QuickBranchRow[] {
  const safeCount = Math.max(1, count)
  const prefix = companyCodePrefix(company?.companyName ?? "Branch")
  const hqLocation = headOfficeLocationFromCompany(company)

  return Array.from({ length: safeCount }, (_, index) => {
    const name = defaultBranchName(index)
    const isHeadOffice = index === 0
    return createEmptyBranchRow(index, prefix, {
      id: `draft-${index + 1}`,
      name,
      location: isHeadOffice ? hqLocation : "",
      contactNumber: isHeadOffice ? (company?.contact ?? "") : "",
      contactEmail: isHeadOffice ? (company?.email ?? "") : "",
      codeAuto: true,
    })
  })
}

/** Demo locations for remaining empty rows (beyond Head Office). */
export const DEMO_BRANCH_LOCATIONS = [
  "Pokhara",
  "Biratnagar",
  "Butwal",
  "Nepalgunj",
  "Chitwan",
] as const
