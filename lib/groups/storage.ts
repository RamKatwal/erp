import type { Group, StoredGroupConfiguration } from "@/types/group"

import { createDefaultGroupPermissions } from "./permissions"

const CUSTOM_GROUPS_STORAGE_KEY = "ibmerp-custom-groups"
const GROUP_CONFIGURATION_STORAGE_PREFIX = "ibmerp-group-configuration"

function getGroupConfigurationKey(groupId: string) {
  return `${GROUP_CONFIGURATION_STORAGE_PREFIX}:${groupId}`
}

export function getGroupDashboardLayoutStorageKey(groupId: string) {
  return `ibmerp-group-dashboard-layout:${groupId}`
}

export function readCustomGroups(): Group[] {
  try {
    const saved = window.localStorage.getItem(CUSTOM_GROUPS_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Group[]) : []
  } catch {
    return []
  }
}

export function readGroupConfiguration(
  group: Group
): StoredGroupConfiguration {
  try {
    const saved = window.localStorage.getItem(
      getGroupConfigurationKey(group.id)
    )
    if (saved) {
      return JSON.parse(saved) as StoredGroupConfiguration
    }
  } catch {
    // Fall back to the mock group configuration.
  }

  return {
    ...group,
    permissions: createDefaultGroupPermissions(group.id),
  }
}

export function saveGroupConfiguration(
  configuration: StoredGroupConfiguration,
  isNewGroup: boolean
) {
  window.localStorage.setItem(
    getGroupConfigurationKey(configuration.id),
    JSON.stringify(configuration)
  )

  if (!isNewGroup) return

  const customGroups = readCustomGroups()
  const group: Group = {
    id: configuration.id,
    name: configuration.name,
    description: configuration.description,
  }
  window.localStorage.setItem(
    CUSTOM_GROUPS_STORAGE_KEY,
    JSON.stringify([...customGroups.filter((item) => item.id !== group.id), group])
  )
}
