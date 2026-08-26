import { isHeadOfficeBranch as matchHeadOfficeLabel } from "@/lib/companies/options"
import type { Branch } from "@/types/branch"

/** True for the permanent Head Office branch (never deactivate or delete). */
export function isHeadOfficeBranch(branch: Pick<Branch, "name" | "code" | "id">) {
  if (branch.id === "br-hq") return true
  return matchHeadOfficeLabel(branch.name, branch.code)
}

export function canDeactivateBranch(branch: Pick<Branch, "name" | "code" | "id">) {
  return !isHeadOfficeBranch(branch)
}

export function canDeleteBranch(branch: Pick<Branch, "name" | "code" | "id">) {
  return !isHeadOfficeBranch(branch)
}

/** Keep Head Office active whenever branches are written. */
export function ensureHeadOfficeActive(branches: Branch[]): Branch[] {
  return branches.map((branch) =>
    isHeadOfficeBranch(branch) && branch.status !== "active"
      ? { ...branch, status: "active" }
      : branch
  )
}
