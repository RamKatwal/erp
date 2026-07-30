import { ConfigurationsPlaceholderPage } from "@/components/settings/configurations-placeholder-page"

export default function BillingPlansPage() {
  return (
    <ConfigurationsPlaceholderPage
      href="/configurations/billing-plans"
      fallbackTitle="Billing & Plans"
      fallbackDescription="View subscription plans and billing details."
    />
  )
}
