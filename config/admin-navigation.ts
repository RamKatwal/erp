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
    children: [
      {
        title: "Branch Management",
        href: "/admin/settings/branch-management",
        icon: DuoSettingsIcon,
        description: "Create and manage company branches.",
      },
      {
        title: "Users & Permissions",
        href: "/admin/settings/users-permissions",
        icon: DuoSettingsIcon,
        description: "Manage groups, users, and entity permissions.",
      },
    ],
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
  for (const item of adminNavigation) {
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
