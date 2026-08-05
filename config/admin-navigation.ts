import {
  DuoCompanyListsIcon,
  DuoHomeIcon,
  DuoSettingsIcon,
} from "@/components/icons/duo"

import type { NavItem } from "@/types/navigation"

export const adminNavigation: NavItem[] = [
  {
    title: "Home",
    href: "/admin",
    icon: DuoHomeIcon,
  },
  {
    title: "Company Lists",
    href: "/admin/companies",
    icon: DuoCompanyListsIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: DuoSettingsIcon,
  },
  {
    title: "Configurations",
    href: "/admin/configurations",
    icon: DuoSettingsIcon,
  },
]

export const adminBrand = {
  name: "Providhy",
}

export function getAdminNavItemByHref(href: string): NavItem | undefined {
  return adminNavigation.find((item) => item.href === href)
}
