export type UserStatus = "active" | "inactive"

/** One branch assignment with the role that grants permissions for that entity. */
export type UserEntityAssignment = {
  branchId: string
  /** Role id (stored as groupId for compatibility). */
  groupId: string
}

export type AppUser = {
  id: string
  name: string
  email: string
  status: UserStatus
  /** A user may belong to one or more entities; each has its own role. */
  assignments: UserEntityAssignment[]
  createdAt: string
}
