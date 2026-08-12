import {
  DuoBranchIcon,
  DuoCompanyListsIcon,
  DuoConfigurationsIcon,
  DuoHomeIcon,
  DuoPaymentsIcon,
  DuoPermissionsIcon,
  DuoSettingsIcon,
  DuoUsersIcon,
} from "@/components/icons/duo"

import type { NavItem } from "@/types/navigation"

export const organizationNavigation: NavItem[] = [
  {
    title: "Branch Management",
    href: "/admin/organizations/branch-management",
    icon: DuoBranchIcon,
    description: "Create and manage company branches.",
  },
  {
    title: "Permission Management",
    href: "/admin/organizations/permissions",
    icon: DuoPermissionsIcon,
    description: "Configure module permissions per group and branch.",
  },
]

export const adminNavigation: NavItem[] = [
  {
    title: "Home",
    href: "/admin",
    icon: DuoHomeIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: DuoSettingsIcon,
    children: [
      {
        title: "Users & Permissions",
        href: "/admin/settings/users-permissions",
        icon: DuoUsersIcon,
        description: "Manage groups and users.",
      },
    ],
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: DuoPaymentsIcon,
    description:
      "Manage software licensing and branch entitlement usage across companies.",
  },
  {
    title: "Configurations",
    href: "/admin/configurations",
    icon: DuoConfigurationsIcon,
  },
  {
    title: "Organizations",
    href: "/admin/organizations",
    icon: DuoCompanyListsIcon,
    children: organizationNavigation,
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
