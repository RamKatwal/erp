import { Suspense } from "react"

import PaymentCheckoutClient from "@/components/onboarding/payment-checkout-client"
import { Spinner } from "@/components/ui/spinner"

export default function PaymentCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner size={24} variant="default" />
        </div>
      }
    >
      <PaymentCheckoutClient />
    </Suspense>
  )
}
