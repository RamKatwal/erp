import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function CostTermsPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/general/cost-terms"
      fallbackTitle="Cost Terms"
      fallbackDescription="Manage cost calculation terms and labels."
    />
  )
}
