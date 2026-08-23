import { createEmptyGroupPermissions } from "@/lib/groups/permissions"
import { mockGroupBranchPermissions } from "@/lib/mock/group-branch-permissions"
import type { GroupBranchPermissionAssignment } from "@/types/permission-assignment"
import type { GroupPermissions } from "@/types/group"

const GROUP_BRANCH_PERMISSIONS_STORAGE_KEY = "ibmerp-group-branch-permissions"

export function permissionAssignmentKey(groupId: string, branchId: string) {
  return `${groupId}::${branchId}`
}

export function readGroupBranchPermissions(): GroupBranchPermissionAssignment[] {
  try {
    const saved = window.localStorage.getItem(
      GROUP_BRANCH_PERMISSIONS_STORAGE_KEY
    )
    if (saved) {
      return JSON.parse(saved) as GroupBranchPermissionAssignment[]
    }
  } catch {
    // Fall back to mock seed data.
  }

  return mockGroupBranchPermissions.map((entry) => ({
    ...entry,
    permissions: { ...entry.permissions },
  }))
}

export function saveGroupBranchPermissions(
  assignments: GroupBranchPermissionAssignment[]
) {
  window.localStorage.setItem(
    GROUP_BRANCH_PERMISSIONS_STORAGE_KEY,
    JSON.stringify(assignments)
  )
}

export function readGroupBranchPermission(
  groupId: string,
  branchId: string
): GroupPermissions {
  const match = readGroupBranchPermissions().find(
    (entry) => entry.groupId === groupId && entry.branchId === branchId
  )
  return match?.permissions ?? createEmptyGroupPermissions()
}

export function upsertGroupBranchPermission(
  groupId: string,
  branchId: string,
  permissions: GroupPermissions
) {
  const current = readGroupBranchPermissions()
  const nextEntry: GroupBranchPermissionAssignment = {
    groupId,
    branchId,
    permissions,
    updatedAt: new Date().toISOString(),
  }
  const index = current.findIndex(
    (entry) => entry.groupId === groupId && entry.branchId === branchId
  )
  const next =
    index >= 0
      ? current.map((entry, i) => (i === index ? nextEntry : entry))
      : [...current, nextEntry]

  saveGroupBranchPermissions(next)
  return nextEntry
}

/** Persist the same matrix for one group across multiple branches. */
export function upsertGroupBranchPermissions(
  groupId: string,
  branchIds: string[],
  permissions: GroupPermissions
) {
  const uniqueBranchIds = [...new Set(branchIds.filter(Boolean))]
  if (uniqueBranchIds.length === 0) return []

  let current = readGroupBranchPermissions()
  const updatedAt = new Date().toISOString()
  const written: GroupBranchPermissionAssignment[] = []

  for (const branchId of uniqueBranchIds) {
    const nextEntry: GroupBranchPermissionAssignment = {
      groupId,
      branchId,
      permissions,
      updatedAt,
    }
    const index = current.findIndex(
      (entry) => entry.groupId === groupId && entry.branchId === branchId
    )
    current =
      index >= 0
        ? current.map((entry, i) => (i === index ? nextEntry : entry))
        : [...current, nextEntry]
    written.push(nextEntry)
  }

  saveGroupBranchPermissions(current)
  return written
}
