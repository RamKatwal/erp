import { ConfigurationsPlaceholderPage } from "@/components/settings/configurations-placeholder-page"

export default function PermissionManagementPage() {
  return (
    <ConfigurationsPlaceholderPage
      href="/configurations/users/permission-management"
      fallbackTitle="Permission Management"
      fallbackDescription="Assign module and action-level permissions."
    />
  )
}
