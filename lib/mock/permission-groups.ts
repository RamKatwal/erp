import type { Group } from "@/types/group"

/** Seed groups for Users & Permissions. Permissions live on group × branch, not here. */
export const mockPermissionGroups: Group[] = [
  {
    id: "grp-branch-cashier",
    name: "Branch Cashier",
    description: "Counter staff and cashiers.",
  },
  {
    id: "grp-branch-manager",
    name: "Branch Manager",
    description: "Store managers and branch heads.",
  },
]
