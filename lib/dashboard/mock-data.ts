export const businessOverviewStats = [
  { label: "Total Sales", value: 245680 },
  { label: "Total Receipt", value: 198420 },
  { label: "Total Purchase", value: 153870 },
  { label: "Total Payment", value: 112640 },
] as const

export const financialInsightData = [
  { day: "1", inflow: 8200, outflow: 3900 },
  { day: "5", inflow: 11600, outflow: 5200 },
  { day: "10", inflow: 9800, outflow: 6400 },
  { day: "15", inflow: 14200, outflow: 7600 },
  { day: "20", inflow: 12100, outflow: 6900 },
  { day: "25", inflow: 15600, outflow: 8300 },
  { day: "30", inflow: 13400, outflow: 7400 },
]

export const receivablesPayablesData = [
  { category: "Receivables", amount: 82443.6 },
  { category: "Payables", amount: 415000 },
]

export const receivableAgeingData = [
  { bucket: "recent", label: "5 - 9 days", amount: 12000 },
  { bucket: "overdue", label: "10+ days", amount: 70443.6 },
]

export const revenueInflowStats = [
  { label: "Cash Collection", value: 35890 },
  { label: "Cash Balance (Till Now)", value: 16570.5 },
  { label: "Bank Collection", value: 22840 },
  { label: "Bank Balance (Till Now)", value: 1185 },
] as const

export type TransactionType = "purchase" | "sales" | "accounting"

export type DashboardTransaction = {
  id: string
  date: string
  customer: string
  description: string
  amount: number
  type: TransactionType
}

export const dashboardTransactions: DashboardTransaction[] = [
  {
    id: "1",
    date: "2083-03-30",
    customer: "Custom One",
    description: "Sales Return",
    amount: 1310.8,
    type: "sales",
  },
  {
    id: "2",
    date: "2083-03-30",
    customer: "Custom One",
    description: "Sales Return",
    amount: 1310.8,
    type: "sales",
  },
  {
    id: "3",
    date: "2083-03-30",
    customer: "Custom One",
    description: "Sales Return",
    amount: 1310.8,
    type: "sales",
  },
  {
    id: "4",
    date: "2083-03-30",
    customer: "Custom One",
    description: "Sales Return",
    amount: 1310.8,
    type: "sales",
  },
  {
    id: "5",
    date: "2083-03-30",
    customer: "Custom One",
    description: "Sales Return",
    amount: 1310.8,
    type: "sales",
  },
  {
    id: "6",
    date: "2083-03-28",
    customer: "Acme Corp",
    description: "Purchase Invoice",
    amount: 45200,
    type: "purchase",
  },
  {
    id: "7",
    date: "2083-03-27",
    customer: "General Ledger",
    description: "Journal Voucher",
    amount: 8500,
    type: "accounting",
  },
]

export const quickAccessActions = [
  { label: "Add Products", href: "/inventory/products" },
  { label: "Add Purchase Invoice", href: "/purchase/order" },
  { label: "Add Supplier Payment", href: "/purchase/payments" },
  { label: "Add Sales Invoice", href: "/sales/order" },
  { label: "Add Customer Payment", href: "/sales/payments" },
  { label: "Add Journal Voucher", href: "/accounting" },
] as const
