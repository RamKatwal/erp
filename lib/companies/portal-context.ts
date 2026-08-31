import { getBranchLocation } from "@/lib/branches/location"
import {
  getCompanyById,
  type CompanyBranchOption,
  type CompanyOption,
} from "@/lib/companies/options"
import {
  saveActiveBranchId,
  saveBranches,
} from "@/lib/branches/storage"
import type { Branch, BranchStatus } from "@/types/branch"

const ACTIVE_COMPANY_STORAGE_KEY = "ibmerp-active-company"

export function readActiveCompanyId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveActiveCompanyId(companyId: string) {
  window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, companyId)
}

function toBranchStatus(status: string): BranchStatus {
  return status.toLowerCase() === "active" ? "active" : "inactive"
}

function toPortalBranch(branch: CompanyBranchOption): Branch {
  return {
    id: branch.id,
    name: branch.name,
    code: branch.code,
    address: branch.address || branch.location || getBranchLocation(branch),
    contactNumber: "",
    contactEmail: "",
    status: toBranchStatus(branch.status),
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

export function getActiveBranches(company: CompanyOption): CompanyBranchOption[] {
  return company.branches.filter(
    (branch) => branch.status.toLowerCase() === "active"
  )
}

/** Persist company + branch, hydrate HO portal branch list, then ready to navigate. */
export function enterCompanyPortal(
  companyId: string,
  branchId: string
): { company: CompanyOption; branch: CompanyBranchOption } | null {
  const company = getCompanyById(companyId)
  if (!company) return null

  const activeBranches = getActiveBranches(company)
  const branch =
    activeBranches.find((item) => item.id === branchId) ?? activeBranches[0]
  if (!branch) return null

  saveActiveCompanyId(company.id)
  saveBranches(activeBranches.map(toPortalBranch))
  saveActiveBranchId(branch.id)

  return { company, branch }
}
