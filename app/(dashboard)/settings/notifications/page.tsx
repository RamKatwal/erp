import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function NotificationsPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/notifications"
      fallbackTitle="Notifications"
      fallbackDescription="Configure email and in-app notification preferences."
    />
  )
}
