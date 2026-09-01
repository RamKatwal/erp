export const CUSTOMER_TYPES = ["individual", "company"] as const
export const CUSTOMER_STATUSES = ["active", "inactive"] as const

export type CustomerType = (typeof CUSTOMER_TYPES)[number]
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]

export type Customer = {
  id: string
  type: CustomerType
  name: string
  address: string
  email: string
  contact: string
  category: string
  entryBy: string
  status: CustomerStatus
}

export const customerTypeLabels: Record<CustomerType, string> = {
  individual: "Individual",
  company: "Company",
}

export const customerStatusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
}
