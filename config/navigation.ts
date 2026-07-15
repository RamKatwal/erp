import {
  BarChart3,
  Box,
  Calculator,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Home,
  Landmark,
  ListTree,
  LogOut,
  Package,
  PackageX,
  Ruler,
  ScrollText,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Tags,
  Truck,
  Undo2,
  Wallet,
} from "lucide-react"

import type { NavItem } from "@/types/navigation"

export const mainNavigation: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
    children: [
      {
        title: "Products",
        href: "/inventory/products",
        icon: Box,
        description: "Manage product catalog and item details.",
      },
      {
        title: "Product Category",
        href: "/inventory/product-category",
        icon: Tags,
        description: "Organize products into categories and groups.",
      },
      {
        title: "Unit",
        href: "/inventory/unit",
        icon: Ruler,
        description: "Define measurement units for inventory items.",
      },
      {
        title: "Stock Adjustment",
        href: "/inventory/stock-adjustment",
        icon: SlidersHorizontal,
        description: "Adjust stock levels and reconcile inventory.",
      },
    ],
  },
  {
    title: "Purchase",
    href: "/purchase",
    icon: Truck,
    children: [
      {
        title: "Return",
        href: "/purchase/return",
        icon: Undo2,
        description: "Process purchase returns and credit notes.",
      },
      {
        title: "Order",
        href: "/purchase/order",
        icon: ClipboardList,
        description: "Create and track purchase orders.",
      },
      {
        title: "Requisition",
        href: "/purchase/requisition",
        icon: FileText,
        description: "Submit and approve purchase requisitions.",
      },
      {
        title: "Expense",
        href: "/purchase/expense",
        icon: Wallet,
        description: "Record and manage purchase expenses.",
      },
      {
        title: "Payments",
        href: "/purchase/payments",
        icon: CreditCard,
        description: "Track supplier payments and settlements.",
      },
    ],
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    children: [
      {
        title: "Return",
        href: "/sales/return",
        icon: Undo2,
        description: "Handle sales returns and refunds.",
      },
      {
        title: "Order",
        href: "/sales/order",
        icon: ClipboardList,
        description: "Manage customer sales orders.",
      },
      {
        title: "Quotation",
        href: "/sales/quotation",
        icon: FileSpreadsheet,
        description: "Create and send sales quotations.",
      },
      {
        title: "Delivery Note",
        href: "/sales/delivery-note",
        icon: Truck,
        description: "Issue delivery notes for shipments.",
      },
      {
        title: "Return Delivery Note",
        href: "/sales/return-delivery-note",
        icon: PackageX,
        description: "Process returned goods delivery notes.",
      },
      {
        title: "Payments",
        href: "/sales/payments",
        icon: CreditCard,
        description: "Record customer payments and receipts.",
      },
    ],
  },
  {
    title: "Accounting",
    href: "/accounting",
    icon: Calculator,
    children: [
      {
        title: "Chart of Accounts",
        href: "/accounting/chart-of-accounts",
        icon: ListTree,
        description: "Manage account structure and ledgers.",
      },
      {
        title: "Bank Accounts",
        href: "/accounting/bank-accounts",
        icon: Landmark,
        description: "Configure and monitor bank accounts.",
      },
      {
        title: "Cheques",
        href: "/accounting/cheques",
        icon: ScrollText,
        description: "Track issued and received cheques.",
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
]

export const secondaryNavigation: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    href: "/logout",
    icon: LogOut,
  },
]

export const appBrand = {
  name: "ABC Company",
  plan: "Platform",
}

export function getNavItemByHref(href: string): NavItem | undefined {
  for (const item of mainNavigation) {
    if (item.href === href) {
      return item
    }

    if (item.children) {
      const child = item.children.find((entry) => entry.href === href)

      if (child) {
        return child
      }
    }
  }

  return undefined
}
