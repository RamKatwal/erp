import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function ProductConfigurationPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/general/product-configuration"
      fallbackTitle="Product Configuration"
      fallbackDescription="Configure product defaults and catalog options."
    />
  )
}
