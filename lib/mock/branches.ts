import type { Branch } from "@/types/branch"

export const mockBranches: Branch[] = [
  {
    id: "br-hq",
    name: "Head Office",
    code: "HQ",
    address: "Durbar Marg, Kathmandu 44600",
    contactNumber: "+977-1-4210000",
    contactEmail: "hq@abccompany.com",
    status: "active",
    createdAt: "2025-11-12",
  },
  {
    id: "br-pokhara",
    name: "Pokhara Branch",
    code: "PKR",
    address: "Lakeside Road, Pokhara 33700",
    contactNumber: "+977-61-520100",
    contactEmail: "pokhara@abccompany.com",
    status: "active",
    createdAt: "2026-02-03",
  },
]
