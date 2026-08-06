import type { GroupPermissions } from "@/types/group"

/**
 * Permissions for a group at a specific entity (branch).
 * Users in that group assigned to that branch inherit these permissions.
 */
export type GroupBranchPermissionAssignment = {
  groupId: string
  branchId: string
  permissions: GroupPermissions
  updatedAt: string
}
