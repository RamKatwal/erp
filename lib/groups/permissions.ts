import {
  GROUP_PERMISSION_ACTIONS,
  type GroupPermissionAction,
  type GroupPermissions,
} from "@/types/group"

export type PermissionItem = {
  id: string
  label: string
  actions?: GroupPermissionAction[]
}

export type PermissionModule = {
  id: string
  label: string
  items: PermissionItem[]
}

const STANDARD_ACTIONS = [...GROUP_PERMISSION_ACTIONS]
const VIEW_ONLY: GroupPermissionAction[] = ["view"]

export const GROUP_PERMISSION_MODULES: PermissionModule[] = [
  {
    id: "inventory",
    label: "Inventory",
    items: [
      { id: "inventory.products", label: "Products" },
      { id: "inventory.categories", label: "Product Categories" },
      { id: "inventory.units", label: "Units" },
      { id: "inventory.stock-adjustments", label: "Stock Adjustments" },
    ],
  },
  {
    id: "purchase",
    label: "Purchase",
    items: [
      { id: "purchase.returns", label: "Returns" },
      { id: "purchase.orders", label: "Orders" },
      { id: "purchase.requisitions", label: "Requisitions" },
      { id: "purchase.expenses", label: "Expenses" },
      { id: "purchase.payments", label: "Payments" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { id: "sales.returns", label: "Returns" },
      { id: "sales.orders", label: "Orders" },
      { id: "sales.quotations", label: "Quotations" },
      { id: "sales.delivery-notes", label: "Delivery Notes" },
      {
        id: "sales.return-delivery-notes",
        label: "Return Delivery Notes",
      },
      { id: "sales.payments", label: "Payments" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    items: [
      { id: "accounting.chart-of-accounts", label: "Chart of Accounts" },
      { id: "accounting.bank-accounts", label: "Bank Accounts" },
      { id: "accounting.cheques", label: "Cheques" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [{ id: "reports.all", label: "Reports", actions: VIEW_ONLY }],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { id: "settings.general", label: "General Settings" },
      { id: "settings.groups", label: "Groups & Permissions" },
      { id: "settings.users", label: "User Management" },
      { id: "settings.billing", label: "Billing & Plans", actions: VIEW_ONLY },
      { id: "settings.notifications", label: "Notifications" },
    ],
  },
]

export function getPermissionItemActions(item: PermissionItem) {
  return item.actions ?? STANDARD_ACTIONS
}

export function createFullGroupPermissions(): GroupPermissions {
  return Object.fromEntries(
    GROUP_PERMISSION_MODULES.flatMap((module) =>
      module.items.map((item) => [
        item.id,
        [...getPermissionItemActions(item)],
      ])
    )
  )
}

export function createDefaultGroupPermissions(groupId: string): GroupPermissions {
  if (groupId === "grp-admin") {
    return createFullGroupPermissions()
  }

  const allowedModuleIds: Record<string, string[]> = {
    "grp-staff": ["purchase", "sales", "accounting"],
    "grp-accountant": ["accounting", "reports"],
    "grp-sales": ["sales"],
    "grp-purchase": ["purchase"],
  }
  const allowed = new Set(allowedModuleIds[groupId] ?? [])

  return Object.fromEntries(
    GROUP_PERMISSION_MODULES.flatMap((module) =>
      module.items.map((item) => [
        item.id,
        allowed.has(module.id) ? [...getPermissionItemActions(item)] : [],
      ])
    )
  )
}
