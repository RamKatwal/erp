import {
  BarChart3,
  Calculator,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Truck,
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
  },
  {
    title: "Purchase",
    href: "/purchase",
    icon: Truck,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Accounting",
    href: "/accounting",
    icon: Calculator,
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
]

export const appBrand = {
  name: "Acme Inc",
  plan: "Enterprise",
}
