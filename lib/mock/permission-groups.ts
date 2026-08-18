import type { Group } from "@/types/group"

/** Seed user roles for Settings. Permissions live on role × branch, not here. */
export const mockPermissionGroups: Group[] = [
  {
    id: "grp-branch-cashier",
    name: "Branch Cashier",
    description: "Counter staff and cashiers.",
    companyIds: ["comp_10294"],
    companyNames: ["Omniverse"],
    branchIds: ["br_hq_01"],
  },
  {
    id: "grp-store-associate",
    name: "Store Associate",
    description: "Floor staff at a single outlet.",
    companyIds: ["comp_10881"],
    companyNames: ["Himalayan Traders"],
    branchIds: ["br_ht_02"],
  },
  {
    id: "grp-branch-manager",
    name: "Branch Manager",
    description: "Store managers and branch heads.",
    companyIds: ["comp_10294", "comp_10881"],
    companyNames: ["Omniverse", "Himalayan Traders"],
    branchIds: ["br_hq_01", "br_ht_01", "br_ht_02"],
  },
]
