import { getAllCompanyAccess } from "@/lib/companies/options"
import { mockPermissionGroups } from "@/lib/mock/permission-groups"
import {
  ADMIN_ROLE_ID,
  isProtectedRole,
  normalizeGroupCompanies,
  type Group,
} from "@/types/group"

const PERMISSION_GROUPS_STORAGE_KEY = "ibmerp-permission-groups-v2"

const DEFAULT_ROLE_ORDER = [ADMIN_ROLE_ID, "grp-accountant", "grp-sales"]

export function createPermissionGroupId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return `grp-${slug || "group"}-${Date.now()}`
}

function withProtectedAdminAccess(group: Group): Group {
  const access = getAllCompanyAccess()
  return {
    ...group,
    id: ADMIN_ROLE_ID,
    name: "Admin",
    locked: true,
    status: "active",
    companyIds: access.companyIds,
    companyNames: access.companyNames,
    branchIds: access.branchIds,
    companyId: access.companyIds[0],
    companyName: access.companyNames[0],
  }
}

function sortPermissionGroups(groups: Group[]) {
  return [...groups].sort((a, b) => {
    const aIndex = DEFAULT_ROLE_ORDER.indexOf(a.id)
    const bIndex = DEFAULT_ROLE_ORDER.indexOf(b.id)
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
}

export function ensureDefaultPermissionGroups(groups: Group[]): Group[] {
  const byId = new Map(groups.map((group) => [group.id, group]))
  const next = [...groups]

  for (const seed of mockPermissionGroups) {
    if (!byId.has(seed.id)) {
      next.push(seed)
      byId.set(seed.id, seed)
    }
  }

  return sortPermissionGroups(
    next.map((group) => {
      const normalized = normalizeGroupCompanies(group)
      return isProtectedRole(normalized)
        ? withProtectedAdminAccess(normalized)
        : normalized
    })
  )
}

export function readPermissionGroups(): Group[] {
  try {
    const saved = window.localStorage.getItem(PERMISSION_GROUPS_STORAGE_KEY)
    if (saved) {
      return ensureDefaultPermissionGroups(JSON.parse(saved) as Group[])
    }
  } catch {
    // Fall back to mock seed data.
  }

  return ensureDefaultPermissionGroups(
    mockPermissionGroups.map((group) => ({ ...group }))
  )
}

export function savePermissionGroups(groups: Group[]) {
  window.localStorage.setItem(
    PERMISSION_GROUPS_STORAGE_KEY,
    JSON.stringify(ensureDefaultPermissionGroups(groups))
  )
}
