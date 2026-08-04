import { Suspense } from "react"

import CompanyDetailsForm from "@/components/onboarding/company-details-form"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingCompanyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24">
          <Spinner size={24} variant="default" />
        </div>
      }
    >
      <CompanyDetailsForm />
    </Suspense>
  )
}
