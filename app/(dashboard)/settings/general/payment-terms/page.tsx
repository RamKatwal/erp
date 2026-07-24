import { SettingsPlaceholderPage } from "@/components/settings/settings-placeholder-page"

export default function PaymentTermsPage() {
  return (
    <SettingsPlaceholderPage
      href="/settings/general/payment-terms"
      fallbackTitle="Payment Terms"
      fallbackDescription="Define payment due dates and term labels."
    />
  )
}
