import type { Customer } from "@/types/customer"

export const mockCustomers: Customer[] = [
  {
    id: "CUS1",
    type: "company",
    name: "Custom One",
    address: "Baneshwor",
    email: "billing@customone.com",
    contact: "9801112233",
    category: "Customer Category 1",
    entryBy: "ram",
    status: "active",
  },
  {
    id: "CUS2",
    type: "company",
    name: "Acme Corp",
    address: "Thamel",
    email: "accounts@acmecorp.com",
    contact: "9812223344",
    category: "Customer Category 1",
    entryBy: "admin",
    status: "active",
  },
  {
    id: "CUS3",
    type: "individual",
    name: "General Ledger",
    address: "Patan",
    email: "gl.client@example.com",
    contact: "",
    category: "Customer Category 2",
    entryBy: "ram",
    status: "active",
  },
  {
    id: "CUS4",
    type: "individual",
    name: "Demo Test",
    address: "Kirtipur",
    email: "demo@test.com",
    contact: "9823334455",
    category: "Customer Category 2",
    entryBy: "admin",
    status: "inactive",
  },
]

export const customerCategories = [
  "All",
  "Customer Category 1",
  "Customer Category 2",
] as const
