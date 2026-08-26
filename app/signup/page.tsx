import AuthMarketingPanel from "@/components/auth-marketing-panel"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden h-svh md:flex md:w-1/2 md:p-6">
        <AuthMarketingPanel className="min-h-full" brandHref="/signup" />
      </div>
      <div className="flex w-full flex-1 items-center justify-center overflow-y-auto p-5 md:w-1/2 md:p-6">
        <SignupForm />
      </div>
    </div>
  )
}
