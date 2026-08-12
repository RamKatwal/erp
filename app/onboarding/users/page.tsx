import { Suspense } from "react"

import UsersSetupForm from "@/components/onboarding/users-setup-form"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24">
          <Spinner size={24} variant="default" />
        </div>
      }
    >
      <UsersSetupForm />
    </Suspense>
  )
}
