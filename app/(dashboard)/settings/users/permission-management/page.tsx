import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function PermissionManagementPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/users/permission-management"
      fallbackTitle="Permission Management"
      fallbackDescription="Assign module and action-level permissions."
    />
  )
}
