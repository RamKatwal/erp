import type { Supplier } from "@/types/supplier"

export const mockSuppliers: Supplier[] = [
  {
    id: "SUP1",
    type: "individual",
    name: "Ram Katwal",
    address: "Suryabinayak",
    email: "alexfmz.777@gmail.com",
    contact: "",
    category: "Supplier Category 1",
    entryBy: "ram",
    status: "active",
  },
  {
    id: "SUP2",
    type: "company",
    name: "Coffee Nepal",
    address: "Kathmandu",
    email: "contact@coffeenepal.com",
    contact: "9801234567",
    category: "Supplier Category 1",
    entryBy: "admin",
    status: "active",
  },
  {
    id: "SUP3",
    type: "company",
    name: "Pacific Imports",
    address: "Lalitpur",
    email: "orders@pacificimports.com",
    contact: "9812345678",
    category: "Supplier Category 2",
    entryBy: "ram",
    status: "active",
  },
  {
    id: "SUP4",
    type: "individual",
    name: "Robert Hood",
    address: "Bhaktapur",
    email: "robert.hood@example.com",
    contact: "9823456789",
    category: "Supplier Category 2",
    entryBy: "admin",
    status: "inactive",
  },
]

export const supplierCategories = [
  "All",
  "Supplier Category 1",
  "Supplier Category 2",
] as const
