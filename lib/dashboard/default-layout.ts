import type { Layout, ResponsiveLayouts } from "react-grid-layout"

export const DASHBOARD_WIDGET_IDS = {
  businessOverview: "business-overview",
  financialInsight: "financial-insight",
  receivablesPayables: "receivables-payables",
  receivableAgeing: "receivable-ageing",
  quickAccess: "quick-access",
  revenueInflow: "revenue-inflow",
  transactions: "transactions",
} as const

export type DashboardWidgetId =
  (typeof DASHBOARD_WIDGET_IDS)[keyof typeof DASHBOARD_WIDGET_IDS]

const lgLayout: Layout = [
  {
    i: DASHBOARD_WIDGET_IDS.financialInsight,
    x: 0,
    y: 0,
    w: 4,
    h: 10,
    minW: 3,
    minH: 7,
  },
  {
    i: DASHBOARD_WIDGET_IDS.receivablesPayables,
    x: 4,
    y: 0,
    w: 4,
    h: 10,
    minW: 3,
    minH: 7,
  },
  {
    i: DASHBOARD_WIDGET_IDS.receivableAgeing,
    x: 8,
    y: 0,
    w: 4,
    h: 10,
    minW: 3,
    minH: 7,
  },
  {
    i: DASHBOARD_WIDGET_IDS.quickAccess,
    x: 0,
    y: 10,
    w: 12,
    h: 3,
    minW: 6,
    minH: 2,
  },
  {
    i: DASHBOARD_WIDGET_IDS.revenueInflow,
    x: 0,
    y: 13,
    w: 5,
    h: 8,
    minW: 4,
    minH: 6,
  },
  {
    i: DASHBOARD_WIDGET_IDS.transactions,
    x: 5,
    y: 13,
    w: 7,
    h: 8,
    minW: 4,
    minH: 6,
  },
]

export const defaultDashboardLayouts: ResponsiveLayouts = {
  lg: lgLayout,
  md: lgLayout,
  sm: [
    {
      i: DASHBOARD_WIDGET_IDS.financialInsight,
      x: 0,
      y: 0,
      w: 6,
      h: 10,
      minW: 4,
      minH: 7,
    },
    {
      i: DASHBOARD_WIDGET_IDS.receivablesPayables,
      x: 0,
      y: 10,
      w: 6,
      h: 10,
      minW: 4,
      minH: 7,
    },
    {
      i: DASHBOARD_WIDGET_IDS.receivableAgeing,
      x: 0,
      y: 20,
      w: 6,
      h: 10,
      minW: 4,
      minH: 7,
    },
    {
      i: DASHBOARD_WIDGET_IDS.quickAccess,
      x: 0,
      y: 30,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
    },
    {
      i: DASHBOARD_WIDGET_IDS.revenueInflow,
      x: 0,
      y: 33,
      w: 6,
      h: 8,
      minW: 4,
      minH: 6,
    },
    {
      i: DASHBOARD_WIDGET_IDS.transactions,
      x: 0,
      y: 41,
      w: 6,
      h: 8,
      minW: 4,
      minH: 6,
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
