import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function UserManagementPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/users/user-management"
      fallbackTitle="User Management"
      fallbackDescription="Invite, edit, and deactivate system users."
    />
  )
}
