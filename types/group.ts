export type Group = {
  id: string
  name: string
  description: string
  /** Admin user roles: companies this role applies to. */
  companyIds?: string[]
  companyNames?: string[]
  /**
   * Legacy single-company fields (still read for older localStorage data).
   * Prefer companyIds / companyNames.
   */
  companyId?: string
  companyName?: string
  /** Admin user roles: selected branches / head offices across companies. */
  branchIds?: string[]
}

export const GROUP_PERMISSION_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
] as const

export type GroupPermissionAction = (typeof GROUP_PERMISSION_ACTIONS)[number]

export type GroupPermissions = Record<string, GroupPermissionAction[]>

export type StoredGroupConfiguration = Group & {
  permissions: GroupPermissions
}

/** Normalize legacy single-company roles into multi-company fields. */
export function normalizeGroupCompanies(group: Group): Group {
  const companyIds =
    group.companyIds && group.companyIds.length > 0
      ? group.companyIds
      : group.companyId
        ? [group.companyId]
        : []

  const companyNames =
    group.companyNames && group.companyNames.length > 0
      ? group.companyNames
      : group.companyName
        ? [group.companyName]
        : []

  return {
    ...group,
    companyIds,
    companyNames,
    companyId: companyIds[0],
    companyName: companyNames[0],
  }
}
