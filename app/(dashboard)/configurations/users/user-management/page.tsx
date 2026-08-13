import { UserManagementPage } from "@/components/settings/users-permissions/user-management-page"

export default function UserManagementRoute() {
  return <UserManagementPage roleSource="configuration-roles" />
}
