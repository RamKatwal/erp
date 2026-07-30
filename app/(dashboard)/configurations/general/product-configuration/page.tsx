import { ConfigurationsPlaceholderPage } from "@/components/settings/configurations-placeholder-page"

export default function ProductConfigurationPage() {
  return (
    <ConfigurationsPlaceholderPage
      href="/configurations/general/product-configuration"
      fallbackTitle="Product Configuration"
      fallbackDescription="Configure product defaults and catalog options."
    />
  )
}
