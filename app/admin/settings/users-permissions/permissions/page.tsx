import { redirect } from "next/navigation"

export default function AdminSettingsPermissionsRedirect() {
  redirect("/admin/organizations/permissions")
}
