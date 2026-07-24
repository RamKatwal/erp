import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function BillingPlansPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/billing-plans"
      fallbackTitle="Billing & Plans"
      fallbackDescription="View subscription plans and billing details."
    />
  )
}
