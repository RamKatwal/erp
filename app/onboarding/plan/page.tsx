import { Suspense } from "react"

import PlanSelectionForm from "@/components/onboarding/plan-selection-form"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner size={24} variant="default" />
        </div>
      }
    >
      <PlanSelectionForm />
    </Suspense>
  )
}
