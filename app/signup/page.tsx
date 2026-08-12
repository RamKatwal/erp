import AuthMarketingPanel from "@/components/auth-marketing-panel"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh">
      <div className="hidden w-1/2 p-6 md:block">
        <AuthMarketingPanel />
      </div>
      <div className="flex w-full flex-1 items-center justify-center overflow-y-auto p-5 md:w-1/2">
        <SignupForm />
      </div>
    </div>
  )
}
