import { createDefaultGroupPermissions } from "@/lib/groups/permissions"
import type { GroupBranchPermissionAssignment } from "@/types/permission-assignment"

/** Accountant and Sales at HQ are pre-seeded from default module access. */
export const mockGroupBranchPermissions: GroupBranchPermissionAssignment[] = [
  {
    groupId: "grp-sales",
    branchId: "br_hq_01",
    updatedAt: "2026-05-01T10:00:00.000Z",
    permissions: createDefaultGroupPermissions("grp-sales"),
  },
  {
    groupId: "grp-accountant",
    branchId: "br_hq_01",
    updatedAt: "2026-05-01T10:00:00.000Z",
    permissions: createDefaultGroupPermissions("grp-accountant"),
  },
]
