import { redirect } from "next/navigation"

import { getDefaultUsersPermissionsHref } from "@/config/users-permissions-navigation"

export default function UsersPermissionsIndexPage() {
  redirect(getDefaultUsersPermissionsHref())
}
