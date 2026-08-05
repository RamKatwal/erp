import { Suspense } from "react"

import CompanyDetailsForm from "@/components/onboarding/company-details-form"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingCompanyPage() {
  return (
    <div className="flex-1 py-8 md:py-10">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Spinner size={24} variant="default" />
          </div>
        }
      >
        <CompanyDetailsForm />
      </Suspense>
    </div>
  )
}
