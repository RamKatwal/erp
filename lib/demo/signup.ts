import { DEMO_ADMIN } from "@/lib/demo/auth"

/** Demo values to fill the create-account form for quick testing. */
export const DEMO_SIGNUP = {
  fullName: DEMO_ADMIN.name,
  contact: DEMO_ADMIN.contact,
  email: "demo.user@providhy.com",
  username: "demouser",
  password: "DemoPass1!",
  confirmPassword: "DemoPass1!",
} as const
