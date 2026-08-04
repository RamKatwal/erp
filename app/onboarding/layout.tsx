import { Suspense } from "react"

import { OnboardingStepIndicator } from "@/components/onboarding/onboarding-step-indicator"
import ProvidhyLogo from "@/components/providhy-logo"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <ProvidhyLogo href="/signup" className="text-xl" />
          <Suspense
            fallback={
              <div className="flex h-6 w-40 items-center justify-end">
                <Spinner size={16} variant="default" />
              </div>
            }
          >
            <OnboardingStepIndicator />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  )
}
