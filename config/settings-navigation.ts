export type SettingsNavItem = {
  title: string
  href: string
  description?: string
  children?: SettingsNavItem[]
}

export const settingsNavigation: SettingsNavItem[] = [
  {
    title: "General Setting",
    href: "/settings/general",
    children: [
      {
        title: "Product Configuration",
        href: "/settings/general/product-configuration",
        description: "Configure product defaults and catalog options.",
      },
      {
        title: "Payment Terms",
        href: "/settings/general/payment-terms",
        description: "Define payment due dates and term labels.",
      },
      {
        title: "Cost Terms",
        href: "/settings/general/cost-terms",
        description: "Manage cost calculation terms and labels.",
      },
      {
        title: "Document Template",
        href: "/settings/general/document-template",
        description: "Customize print and PDF document templates.",
      },
    ],
  },
  {
    title: "User & Permissions",
    href: "/settings/users",
    children: [
      {
        title: "Group Management",
        href: "/settings/users/group-management",
        description: "Create and manage user groups and roles.",
      },
      {
        title: "User Management",
        href: "/settings/users/user-management",
        description: "Invite, edit, and deactivate system users.",
      },
      {
        title: "Permission Management",
        href: "/settings/users/permission-management",
        description: "Assign module and action-level permissions.",
      },
    ],
  },
  {
    title: "Billing & Plans",
    href: "/settings/billing-plans",
    description: "View subscription plans and billing details.",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    description: "Configure email and in-app notification preferences.",
  },
  {
    title: "User Activities",
    href: "/settings/user-activities",
    description: "Review recent user activity and audit logs.",
  },
]

export function getSettingsItemByHref(href: string): SettingsNavItem | undefined {
  for (const item of settingsNavigation) {
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

export function getDefaultSettingsHref() {
  return (
    settingsNavigation[0]?.children?.[0]?.href ??
    settingsNavigation[0]?.href ??
    "/settings"
  )
}
