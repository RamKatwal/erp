import { mockPermissionGroups } from "@/lib/mock/permission-groups"
import type { Group } from "@/types/group"

const PERMISSION_GROUPS_STORAGE_KEY = "ibmerp-permission-groups"

export function createPermissionGroupId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return `grp-${slug || "group"}-${Date.now()}`
}

export function readPermissionGroups(): Group[] {
  try {
    const saved = window.localStorage.getItem(PERMISSION_GROUPS_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as Group[]
    }
  } catch {
    // Fall back to mock seed data.
  }

  return mockPermissionGroups.map((group) => ({ ...group }))
}

export function savePermissionGroups(groups: Group[]) {
  window.localStorage.setItem(
    PERMISSION_GROUPS_STORAGE_KEY,
    JSON.stringify(groups)
  )
}
