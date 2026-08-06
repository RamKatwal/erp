/** Prototype main admin credentials for sign-in testing. */
export const DEMO_ADMIN = {
  email: "admin@gmail.com",
  password: "admin@gmail.com",
  name: "Main Admin",
  username: "admin",
  contact: "+977-9800000001",
} as const

export function isDemoAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() &&
    password === DEMO_ADMIN.password
  )
}
