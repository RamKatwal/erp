import { mockUsers } from "@/lib/mock/users"
import type { AppUser } from "@/types/user"

const USERS_STORAGE_KEY = "ibmerp-users"

export function createUserId(email: string) {
  const slug = email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return `usr-${slug || "user"}-${Date.now()}`
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function readUsers(): AppUser[] {
  try {
    const saved = window.localStorage.getItem(USERS_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as AppUser[]
    }
  } catch {
    // Fall back to mock seed data.
  }

  return mockUsers.map((user) => ({
    ...user,
    assignments: user.assignments.map((assignment) => ({ ...assignment })),
  }))
}

export function saveUsers(users: AppUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}
