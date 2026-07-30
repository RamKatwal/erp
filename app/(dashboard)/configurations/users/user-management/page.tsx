import { ConfigurationsPlaceholderPage } from "@/components/settings/configurations-placeholder-page"

export default function UserManagementPage() {
  return (
    <ConfigurationsPlaceholderPage
      href="/configurations/users/user-management"
      fallbackTitle="User Management"
      fallbackDescription="Invite, edit, and deactivate system users."
    />
  )
}
