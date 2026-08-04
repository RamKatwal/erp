import { Suspense } from "react"

import AuthMarketingPanel from "@/components/auth-marketing-panel"
import VerificationForm from "@/components/verification-form"
import { Spinner } from "@/components/ui/spinner"

export default function VerificationPage() {
  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden w-1/2 p-6 md:block">
        <AuthMarketingPanel />
      </div>
      <div className="flex w-full flex-1 items-center justify-center overflow-y-auto p-5 md:w-1/2 md:p-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Spinner size={24} variant="default" />
            </div>
          }
        >
          <VerificationForm />
        </Suspense>
      </div>
    </div>
  )
}
