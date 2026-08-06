export type UserStatus = "active" | "inactive"

/** One branch assignment with the group that grants permissions for that entity. */
export type UserEntityAssignment = {
  branchId: string
  groupId: string
}

export type AppUser = {
  id: string
  name: string
  email: string
  status: UserStatus
  /** A user may belong to one or more entities; each has its own group. */
  assignments: UserEntityAssignment[]
  createdAt: string
}
