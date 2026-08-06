import { Suspense } from "react"

import BranchesSetupForm from "@/components/onboarding/branches-setup-form"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingBranchesPage() {
  return (
    <div className="flex-1 py-8 md:py-10">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Spinner size={24} variant="default" />
          </div>
        }
      >
        <BranchesSetupForm />
      </Suspense>
    </div>
  )
}
