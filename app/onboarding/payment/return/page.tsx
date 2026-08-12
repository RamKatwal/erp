import { Suspense } from "react"

import PaymentReturnClient from "@/components/onboarding/payment-return-client"
import { Spinner } from "@/components/ui/spinner"

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner size={24} variant="default" />
        </div>
      }
    >
      <PaymentReturnClient />
    </Suspense>
  )
}
