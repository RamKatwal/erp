export type UsersPermissionsNavItem = {
  title: string
  href: string
  description?: string
}

export const usersPermissionsNavigation: UsersPermissionsNavItem[] = [
  {
    title: "Groups",
    href: "/admin/settings/users-permissions/groups",
    description: "Create user groups used for permission assignment.",
  },
  {
    title: "User Management",
    href: "/admin/settings/users-permissions/users",
    description: "Invite users and assign them to entities with a group.",
  },
]

export function getUsersPermissionsItemByHref(
  href: string
): UsersPermissionsNavItem | undefined {
  return usersPermissionsNavigation.find((item) => item.href === href)
}

export function getDefaultUsersPermissionsHref() {
  return usersPermissionsNavigation[0]?.href ?? "/admin/settings/users-permissions/groups"
}
