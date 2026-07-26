export type Group = {
  id: string
  name: string
  description: string
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
