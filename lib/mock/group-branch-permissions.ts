import { createEmptyGroupPermissions } from "@/lib/groups/permissions"
import type { GroupBranchPermissionAssignment } from "@/types/permission-assignment"
import type { GroupPermissionAction, GroupPermissions } from "@/types/group"

function actions(
  ...values: GroupPermissionAction[]
): GroupPermissionAction[] {
  return values
}

function mergePermissions(
  overrides: Record<string, GroupPermissionAction[]>
): GroupPermissions {
  return {
    ...createEmptyGroupPermissions(),
    ...overrides,
  }
}

/**
 * Branch Cashier @ HQ and Branch Manager @ HQ are pre-seeded.
 */
export const mockGroupBranchPermissions: GroupBranchPermissionAssignment[] = [
  {
    groupId: "grp-branch-cashier",
    branchId: "br_hq_01",
    updatedAt: "2026-05-01T10:00:00.000Z",
    permissions: mergePermissions({
      "sales.orders": actions("view", "create", "edit"),
      "sales.quotations": actions("view", "create", "edit"),
      "sales.delivery-notes": actions("view", "create"),
      "sales.payments": actions("view", "create"),
      "purchase.orders": actions("view"),
      "purchase.returns": actions("view"),
      "inventory.products": actions("view"),
      "inventory.categories": actions("view"),
      "inventory.units": actions("view"),
      "inventory.stock-adjustments": actions("view"),
      "accounting.chart-of-accounts": actions("view"),
      "accounting.bank-accounts": actions("view"),
      "reports.all": actions("view"),
    }),
  },
  {
    groupId: "grp-branch-manager",
    branchId: "br_hq_01",
    updatedAt: "2026-05-01T10:00:00.000Z",
    permissions: mergePermissions({
      "sales.returns": actions("view", "create", "edit", "delete", "approve"),
      "sales.orders": actions("view", "create", "edit", "delete", "approve"),
      "sales.quotations": actions("view", "create", "edit", "delete", "approve"),
      "sales.delivery-notes": actions(
        "view",
        "create",
        "edit",
        "delete",
        "approve"
      ),
      "sales.return-delivery-notes": actions(
        "view",
        "create",
        "edit",
        "delete",
        "approve"
      ),
      "sales.payments": actions("view", "create", "edit", "delete", "approve"),
      "purchase.returns": actions("view", "create", "edit", "delete", "approve"),
      "purchase.orders": actions("view", "create", "edit", "delete", "approve"),
      "purchase.requisitions": actions(
        "view",
        "create",
        "edit",
        "delete",
        "approve"
      ),
      "purchase.expenses": actions(
        "view",
        "create",
        "edit",
        "delete",
        "approve"
      ),
      "purchase.payments": actions(
        "view",
        "create",
        "edit",
        "delete",
        "approve"
      ),
      "inventory.products": actions("view"),
      "inventory.categories": actions("view"),
      "inventory.units": actions("view", "create", "edit", "delete", "approve"),
      "inventory.stock-adjustments": actions(
        "view",
        "create",
        "edit",
        "delete",
        "approve"
      ),
      "accounting.chart-of-accounts": actions("view", "create", "edit"),
      "accounting.bank-accounts": actions("view", "create", "edit"),
      "accounting.cheques": actions("view", "create", "edit"),
      "reports.all": actions("view"),
    }),
  },
]
