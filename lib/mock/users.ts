import type { AppUser } from "@/types/user"

export const mockUsers: AppUser[] = [
  {
    id: "usr-anita",
    name: "Anita Sharma",
    email: "anita.sharma@omniverse.com",
    status: "active",
    assignments: [{ branchId: "br_hq_01", groupId: "grp-branch-cashier" }],
    createdAt: "2026-03-01",
  },
  {
    id: "usr-ramesh",
    name: "Ramesh Thapa",
    email: "ramesh.thapa@omniverse.com",
    status: "active",
    assignments: [
      { branchId: "br_hq_01", groupId: "grp-branch-manager" },
      { branchId: "br_ht_01", groupId: "grp-branch-manager" },
    ],
    createdAt: "2026-03-12",
  },
  {
    id: "usr-sita",
    name: "Sita Gurung",
    email: "sita.gurung@himalayan.com",
    status: "inactive",
    assignments: [{ branchId: "br_ht_02", groupId: "grp-branch-manager" }],
    createdAt: "2026-04-02",
  },
]
