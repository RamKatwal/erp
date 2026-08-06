import type { AppUser } from "@/types/user"

export const mockUsers: AppUser[] = [
  {
    id: "usr-anita",
    name: "Anita Sharma",
    email: "anita.sharma@abccompany.com",
    status: "active",
    assignments: [
      { branchId: "br-hq", groupId: "grp-branch-cashier" },
      { branchId: "br-pokhara", groupId: "grp-branch-cashier" },
    ],
    createdAt: "2026-03-01",
  },
  {
    id: "usr-ramesh",
    name: "Ramesh Thapa",
    email: "ramesh.thapa@abccompany.com",
    status: "active",
    assignments: [{ branchId: "br-hq", groupId: "grp-branch-manager" }],
    createdAt: "2026-03-12",
  },
  {
    id: "usr-sita",
    name: "Sita Gurung",
    email: "sita.gurung@abccompany.com",
    status: "inactive",
    assignments: [{ branchId: "br-pokhara", groupId: "grp-branch-cashier" }],
    createdAt: "2026-04-02",
  },
]
