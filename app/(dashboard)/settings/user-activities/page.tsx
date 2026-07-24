import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function UserActivitiesPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/user-activities"
      fallbackTitle="User Activities"
      fallbackDescription="Review recent user activity and audit logs."
    />
  )
}
