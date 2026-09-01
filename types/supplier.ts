export const SUPPLIER_TYPES = ["individual", "company"] as const
export const SUPPLIER_STATUSES = ["active", "inactive"] as const

export type SupplierType = (typeof SUPPLIER_TYPES)[number]
export type SupplierStatus = (typeof SUPPLIER_STATUSES)[number]

export type Supplier = {
  id: string
  type: SupplierType
  name: string
  address: string
  email: string
  contact: string
  category: string
  entryBy: string
  status: SupplierStatus
}

export const supplierTypeLabels: Record<SupplierType, string> = {
  individual: "Individual",
  company: "Company",
}

export const supplierStatusLabels: Record<SupplierStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}
