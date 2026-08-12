"use client"

import { usePathname } from "next/navigation"
import { Suspense } from "react"

import { AppBrand } from "@/components/app-brand"
import { OnboardingStepIndicator } from "@/components/onboarding/onboarding-step-indicator"
import { Spinner } from "@/components/ui/spinner"
import { isSetupPath } from "@/lib/onboarding/status"

function OnboardingHeader() {
  const pathname = usePathname()
  const showSetupStepper = isSetupPath(pathname)
  const isPaymentSubflow = pathname.includes("/onboarding/payment")

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <AppBrand
          href="/signup"
          className="text-foreground"
          nameClassName="text-foreground"
          priority
        />
        {isPaymentSubflow ? (
          <p className="text-sm font-medium text-muted-foreground">Checkout</p>
        ) : showSetupStepper ? (
          <Suspense
            fallback={
              <div className="flex h-6 w-40 items-center justify-end">
                <Spinner size={16} variant="default" />
              </div>
            }
          >
            <OnboardingStepIndicator />
          </Suspense>
        ) : null}
      </div>
    </header>
  )
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <OnboardingHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-0 md:px-8">
        {children}
      </main>
    </div>
  )
}
