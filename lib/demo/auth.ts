/** Prototype credentials for sign-in testing. */

export const DEMO_ADMIN = {
  tenantId: "100000",
  email: "admin@gmail.com",
  password: "admin@gmail.com",
  name: "Main Admin",
  username: "admin",
  contact: "+977-9800000001",
} as const

export const DEMO_USER = {
  tenantId: "111111",
  email: "user@gmail.com",
  password: "user@gmail.com",
  name: "Demo User",
  username: "user",
  contact: "+977-9800000002",
} as const

export function isSixDigitTenantId(tenantId: string) {
  return /^\d{6}$/.test(tenantId.trim())
}

export function isDemoAdminCredentials(
  tenantId: string,
  email: string,
  password: string
) {
  return (
    tenantId.trim() === DEMO_ADMIN.tenantId &&
    email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() &&
    password === DEMO_ADMIN.password
  )
}

export function isDemoUserCredentials(
  tenantId: string,
  email: string,
  password: string
) {
  return (
    tenantId.trim() === DEMO_USER.tenantId &&
    email.trim().toLowerCase() === DEMO_USER.email.toLowerCase() &&
    password === DEMO_USER.password
  )
}
