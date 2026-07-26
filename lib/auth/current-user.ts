export type UserRole = "main-admin" | "member"

export type CurrentUser = {
  id: string
  name: string
  email: string
  initials: string
  role: UserRole
  groupId: string
}

/** Signed-in user for the prototype, until real authentication exists. */
const currentUser: CurrentUser = {
  id: "usr-nick-bold",
  name: "Nick Bold",
  email: "nick@reui.io",
  initials: "NB",
  role: "main-admin",
  groupId: "grp-admin",
}

export function getCurrentUser(): CurrentUser {
  return currentUser
}

export function isMainAdmin(user: CurrentUser = currentUser) {
  return user.role === "main-admin"
}

export function canCustomizeGroupDashboards(user: CurrentUser = currentUser) {
  return isMainAdmin(user)
}
