import { Suspense } from "react"

import { AppBrand } from "@/components/app-brand"
import { OnboardingStepIndicator } from "@/components/onboarding/onboarding-step-indicator"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <AppBrand
            href="/signup"
            className="text-foreground"
            nameClassName="text-foreground"
            priority
          />
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
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-0 md:px-8">
        {children}
      </main>
    </div>
  )
}
