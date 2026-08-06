import { UsersPermissionsShell } from "@/components/settings/users-permissions/users-permissions-shell"

export default function UsersPermissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UsersPermissionsShell>{children}</UsersPermissionsShell>
}
