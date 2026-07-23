export type BusinessOverviewTrend = "up" | "down" | "neutral"

export type BusinessOverviewStat = {
  id: string
  label: string
  value: number
  change: number
  trend: BusinessOverviewTrend
}

export const businessOverviewStats: BusinessOverviewStat[] = [
  {
    id: "total-sales",
    label: "Total Sales",
    value: 245680,
    change: 5.3,
    trend: "up",
  },
  {
    id: "total-receipt",
    label: "Total Receipt",
    value: 198420,
    change: -2.1,
    trend: "down",
  },
  {
    id: "total-purchase",
    label: "Total Purchase",
    value: 153870,
    change: 0,
    trend: "neutral",
  },
  {
    id: "total-payment",
    label: "Total Payment",
    value: 112640,
    change: 12.8,
    trend: "up",
  },
]

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
  { bucket: "current", label: "Current", amount: 18000 },
  { bucket: "days0to4", label: "0 - 4 days", amount: 8000 },
  { bucket: "recent", label: "5 - 9 days", amount: 12000 },
  { bucket: "overdue", label: "10+ days", amount: 44443.6 },
]

export type PayableAgeingRow = {
  id: string
  supplier: string
  amount: number
  days: number
}

export const payableAgeingUpcoming: PayableAgeingRow[] = [
  { id: "u1", supplier: "Anush", amount: 616.5, days: 13 },
  { id: "u2", supplier: "Robert Hood", amount: 300000, days: 20 },
  { id: "u3", supplier: "Robert Hood", amount: 90, days: 21 },
]

export const payableAgeingDue: PayableAgeingRow[] = [
  { id: "d1", supplier: "Coffee Nepal", amount: 2260, days: 10 },
  { id: "d2", supplier: "Coffee Nepal", amount: 621.5, days: 9 },
  { id: "d3", supplier: "Demo Test", amount: 8000, days: 8 },
  { id: "d4", supplier: "Coffee Nepal", amount: 10, days: 8 },
  { id: "d5", supplier: "Robert Hood", amount: 8475, days: 7 },
]

export const revenueInflowStats = [
  { label: "Cash Collection", value: 35890 },
  { label: "Cash Balance (Till Now)", value: 16570.5 },
  { label: "Bank Collection", value: 22840 },
  { label: "Bank Balance (Till Now)", value: 1185 },
] as const

export const cashInOutData = [
  { month: "Feb", cashIn: 18500, cashOut: 14200 },
  { month: "Mar", cashIn: 22100, cashOut: 19800 },
  { month: "Apr", cashIn: 16800, cashOut: 24100 },
  { month: "May", cashIn: 25400, cashOut: 17600 },
  { month: "Jun", cashIn: 21200, cashOut: 22900 },
  { month: "Jul", cashIn: 15684.29, cashOut: 18054.73 },
]

export type BankCashAccount = {
  id: string
  name: string
  accountNumber?: string
  balance: number
  kind: "cash" | "bank" | "wallet"
}

export const bankCashAccounts: BankCashAccount[] = [
  {
    id: "1",
    name: "Cash in hand",
    balance: 13179750,
    kind: "cash",
  },
  {
    id: "2",
    name: "Everest Bank Ltd.",
    balance: -1224.35,
    kind: "bank",
  },
  {
    id: "3",
    name: "Nabil Bank Ltd.",
    accountNumber: "23456789",
    balance: -157905.39,
    kind: "bank",
  },
  {
    id: "4",
    name: "Garima Bikas Bank Ltd.",
    accountNumber: "1011645454",
    balance: 150000,
    kind: "bank",
  },
  {
    id: "5",
    name: "E-sewa",
    balance: -520102,
    kind: "wallet",
  },
  {
    id: "6",
    name: "Global IME Bank Ltd.",
    accountNumber: "2109876543210",
    balance: 845320.5,
    kind: "bank",
  },
  {
    id: "7",
    name: "NIC Asia Bank Ltd.",
    accountNumber: "5544332211",
    balance: -42150.75,
    kind: "bank",
  },
  {
    id: "8",
    name: "Nepal Investment Mega Bank",
    accountNumber: "0123456789012",
    balance: 278450,
    kind: "bank",
  },
  {
    id: "9",
    name: "Khalti",
    balance: 12500,
    kind: "wallet",
  },
  {
    id: "10",
    name: "Prabhu Bank Ltd.",
    accountNumber: "9988776655",
    balance: -89340.2,
    kind: "bank",
  },
  {
    id: "11",
    name: "Sunrise Bank Ltd.",
    accountNumber: "4455667788",
    balance: 196780.4,
    kind: "bank",
  },
  {
    id: "12",
    name: "Cash at Warehouse",
    balance: 85000,
    kind: "cash",
  },
  {
    id: "13",
    name: "Himalayan Bank Ltd.",
    accountNumber: "1122334455",
    balance: -15620.8,
    kind: "bank",
  },
  {
    id: "14",
    name: "IME Pay",
    balance: -34200,
    kind: "wallet",
  },
  {
    id: "15",
    name: "Sanima Bank Ltd.",
    accountNumber: "6677889900",
    balance: 512340.95,
    kind: "bank",
  },
]

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

export const createMenuSections = [
  {
    title: "General",
    items: [
      { label: "Customer", href: "/customers" },
      { label: "Supplier", href: "/suppliers" },
      { label: "Product", href: "/inventory/products" },
      { label: "Contra", href: "/accounting/contra" },
    ],
  },
  {
    title: "Purchase",
    items: [
      { label: "Purchase Invoice", href: "/purchase/invoice" },
      { label: "Purchase Order", href: "/purchase/order" },
      { label: "Purchase Return", href: "/purchase/return" },
      { label: "Supplier Payment", href: "/purchase/payments" },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Sales Invoice", href: "/sales/invoice" },
      { label: "Sales Order", href: "/sales/order" },
      { label: "Customer Payment", href: "/sales/payments" },
      { label: "Sales Return", href: "/sales/return" },
    ],
  },
  {
    title: "Accounting",
    items: [
      { label: "Account", href: "/accounting/chart-of-accounts" },
      { label: "Journal Voucher", href: "/accounting/journal-voucher" },
      { label: "Payment Voucher", href: "/accounting/payment-voucher" },
      { label: "Receipt Voucher", href: "/accounting/receipt-voucher" },
    ],
  },
] as const
