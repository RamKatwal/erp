import type { Layout, LayoutItem, ResponsiveLayouts } from "react-grid-layout"

export const DASHBOARD_WIDGET_IDS = {
  totalSales: "total-sales",
  totalReceipt: "total-receipt",
  totalPurchase: "total-purchase",
  totalPayment: "total-payment",
  financialInsight: "financial-insight",
  receivablesPayables: "receivables-payables",
  receivableAgeing: "receivable-ageing",
  revenueInflow: "revenue-inflow",
  payableAgeing: "payable-ageing",
  cashInOut: "cash-in-out",
  bankCashBalance: "bank-cash-balance",
  transactions: "transactions",
} as const

export type DashboardWidgetId =
  (typeof DASHBOARD_WIDGET_IDS)[keyof typeof DASHBOARD_WIDGET_IDS]

export const ALL_DASHBOARD_WIDGET_IDS = Object.values(
  DASHBOARD_WIDGET_IDS
) as DashboardWidgetId[]

export const DASHBOARD_WIDGET_LABELS: Record<DashboardWidgetId, string> = {
  [DASHBOARD_WIDGET_IDS.totalSales]: "Total Sales",
  [DASHBOARD_WIDGET_IDS.totalReceipt]: "Total Receipt",
  [DASHBOARD_WIDGET_IDS.totalPurchase]: "Total Purchase",
  [DASHBOARD_WIDGET_IDS.totalPayment]: "Total Payment",
  [DASHBOARD_WIDGET_IDS.financialInsight]: "Financial Insight",
  [DASHBOARD_WIDGET_IDS.receivablesPayables]: "Receivables vs Payables",
  [DASHBOARD_WIDGET_IDS.receivableAgeing]: "Receivable Ageing Summary",
  [DASHBOARD_WIDGET_IDS.revenueInflow]: "Revenue Inflow",
  [DASHBOARD_WIDGET_IDS.payableAgeing]: "Payable Ageing Summary",
  [DASHBOARD_WIDGET_IDS.cashInOut]: "Cash In and Out",
  [DASHBOARD_WIDGET_IDS.bankCashBalance]: "Bank and Cash Balance",
  [DASHBOARD_WIDGET_IDS.transactions]: "Transactions",
}

export type DashboardWidgetCategoryId = "overview" | "widgets"

export type DashboardWidgetCatalogItem = {
  id: DashboardWidgetId
  label: string
  category: DashboardWidgetCategoryId
  description?: string
}

export const DASHBOARD_WIDGET_CATEGORIES: {
  id: DashboardWidgetCategoryId
  label: string
}[] = [
  { id: "overview", label: "Overview" },
  { id: "widgets", label: "Widgets" },
]

/** Catalog of widgets that can be shown/hidden from the Add widget popup. */
export const DASHBOARD_WIDGET_CATALOG: DashboardWidgetCatalogItem[] = [
  {
    id: DASHBOARD_WIDGET_IDS.totalSales,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.totalSales],
    category: "overview",
  },
  {
    id: DASHBOARD_WIDGET_IDS.totalReceipt,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.totalReceipt],
    category: "overview",
  },
  {
    id: DASHBOARD_WIDGET_IDS.totalPurchase,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.totalPurchase],
    category: "overview",
  },
  {
    id: DASHBOARD_WIDGET_IDS.totalPayment,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.totalPayment],
    category: "overview",
  },
  {
    id: DASHBOARD_WIDGET_IDS.financialInsight,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.financialInsight],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.receivablesPayables,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.receivablesPayables],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.receivableAgeing,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.receivableAgeing],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.revenueInflow,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.revenueInflow],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.payableAgeing,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.payableAgeing],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.cashInOut,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.cashInOut],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.bankCashBalance,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.bankCashBalance],
    category: "widgets",
  },
  {
    id: DASHBOARD_WIDGET_IDS.transactions,
    label: DASHBOARD_WIDGET_LABELS[DASHBOARD_WIDGET_IDS.transactions],
    category: "widgets",
  },
]

const kpiDefaults = {
  h: 3,
  minW: 2,
  minH: 2,
} satisfies Partial<LayoutItem>

const lgLayout: Layout = [
  {
    i: DASHBOARD_WIDGET_IDS.totalSales,
    x: 0,
    y: 0,
    w: 3,
    ...kpiDefaults,
  },
  {
    i: DASHBOARD_WIDGET_IDS.totalReceipt,
    x: 3,
    y: 0,
    w: 3,
    ...kpiDefaults,
  },
  {
    i: DASHBOARD_WIDGET_IDS.totalPurchase,
    x: 6,
    y: 0,
    w: 3,
    ...kpiDefaults,
  },
  {
    i: DASHBOARD_WIDGET_IDS.totalPayment,
    x: 9,
    y: 0,
    w: 3,
    ...kpiDefaults,
  },
  {
    i: DASHBOARD_WIDGET_IDS.financialInsight,
    x: 0,
    y: 3,
    w: 4,
    h: 10,
    minW: 2,
    minH: 4,
  },
  {
    i: DASHBOARD_WIDGET_IDS.receivablesPayables,
    x: 4,
    y: 3,
    w: 4,
    h: 10,
    minW: 2,
    minH: 4,
  },
  {
    i: DASHBOARD_WIDGET_IDS.receivableAgeing,
    x: 8,
    y: 3,
    w: 4,
    h: 10,
    minW: 2,
    minH: 4,
  },
  {
    i: DASHBOARD_WIDGET_IDS.cashInOut,
    x: 0,
    y: 13,
    w: 4,
    h: 11,
    minW: 3,
    minH: 6,
  },
  {
    i: DASHBOARD_WIDGET_IDS.bankCashBalance,
    x: 4,
    y: 13,
    w: 4,
    h: 11,
    minW: 3,
    minH: 6,
  },
  {
    i: DASHBOARD_WIDGET_IDS.revenueInflow,
    x: 8,
    y: 13,
    w: 4,
    h: 11,
    minW: 2,
    minH: 4,
  },
  {
    i: DASHBOARD_WIDGET_IDS.payableAgeing,
    x: 0,
    y: 24,
    w: 5,
    h: 8,
    minW: 2,
    minH: 4,
  },
  {
    i: DASHBOARD_WIDGET_IDS.transactions,
    x: 5,
    y: 24,
    w: 7,
    h: 8,
    minW: 2,
    minH: 4,
  },
]

export const defaultDashboardLayouts: ResponsiveLayouts = {
  lg: lgLayout,
  md: lgLayout,
  sm: [
    {
      i: DASHBOARD_WIDGET_IDS.totalSales,
      x: 0,
      y: 0,
      w: 3,
      ...kpiDefaults,
    },
    {
      i: DASHBOARD_WIDGET_IDS.totalReceipt,
      x: 3,
      y: 0,
      w: 3,
      ...kpiDefaults,
    },
    {
      i: DASHBOARD_WIDGET_IDS.totalPurchase,
      x: 0,
      y: 3,
      w: 3,
      ...kpiDefaults,
    },
    {
      i: DASHBOARD_WIDGET_IDS.totalPayment,
      x: 3,
      y: 3,
      w: 3,
      ...kpiDefaults,
    },
    {
      i: DASHBOARD_WIDGET_IDS.financialInsight,
      x: 0,
      y: 6,
      w: 6,
      h: 10,
      minW: 2,
      minH: 4,
    },
    {
      i: DASHBOARD_WIDGET_IDS.receivablesPayables,
      x: 0,
      y: 16,
      w: 6,
      h: 10,
      minW: 2,
      minH: 4,
    },
    {
      i: DASHBOARD_WIDGET_IDS.receivableAgeing,
      x: 0,
      y: 26,
      w: 6,
      h: 10,
      minW: 2,
      minH: 4,
    },
    {
      i: DASHBOARD_WIDGET_IDS.cashInOut,
      x: 0,
      y: 36,
      w: 6,
      h: 11,
      minW: 2,
      minH: 6,
    },
    {
      i: DASHBOARD_WIDGET_IDS.bankCashBalance,
      x: 0,
      y: 47,
      w: 6,
      h: 11,
      minW: 2,
      minH: 6,
    },
    {
      i: DASHBOARD_WIDGET_IDS.revenueInflow,
      x: 0,
      y: 58,
      w: 6,
      h: 8,
      minW: 2,
      minH: 4,
    },
    {
      i: DASHBOARD_WIDGET_IDS.payableAgeing,
      x: 0,
      y: 66,
      w: 6,
      h: 8,
      minW: 2,
      minH: 4,
    },
    {
      i: DASHBOARD_WIDGET_IDS.transactions,
      x: 0,
      y: 74,
      w: 6,
      h: 8,
      minW: 2,
      minH: 4,
    },
  ],
}

export const DASHBOARD_LAYOUT_STORAGE_KEY = "ibmerp-dashboard-layout"

export function areDashboardLayoutsEqual(
  a: ResponsiveLayouts,
  b: ResponsiveLayouts
) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function getLayoutWidgetIds(
  layouts: ResponsiveLayouts
): DashboardWidgetId[] {
  return (layouts.lg ?? []).map((item) => item.i as DashboardWidgetId)
}

export function removeWidgetFromLayouts(
  layouts: ResponsiveLayouts,
  widgetId: DashboardWidgetId
): ResponsiveLayouts {
  const next: ResponsiveLayouts = {}

  for (const [breakpoint, layout] of Object.entries(layouts)) {
    next[breakpoint] = (layout ?? []).filter((item) => item.i !== widgetId)
  }

  return next
}

export function restoreWidgetToLayouts(
  layouts: ResponsiveLayouts,
  widgetId: DashboardWidgetId
): ResponsiveLayouts {
  const next = structuredClone(layouts) as ResponsiveLayouts

  for (const [breakpoint, defaultLayout] of Object.entries(
    defaultDashboardLayouts
  )) {
    const defaultItem = (defaultLayout ?? []).find(
      (item) => item.i === widgetId
    )
    if (!defaultItem) continue

    const current = [...(next[breakpoint] ?? [])]
    if (current.some((item) => item.i === widgetId)) continue

    const maxY = current.reduce(
      (max, item) => Math.max(max, item.y + item.h),
      0
    )
    next[breakpoint] = [...current, { ...defaultItem, x: 0, y: maxY }]
  }

  return next
}
