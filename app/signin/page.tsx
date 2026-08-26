import AuthMarketingPanel from "@/components/auth-marketing-panel"
import SignInForm from "@/components/sign-in-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-svh bg-background">
      <div className="hidden h-svh md:flex md:w-1/2 md:p-6">
        <AuthMarketingPanel className="min-h-full" brandHref="/signin" />
      </div>
      <div className="flex w-full items-center justify-center p-5 md:w-1/2 md:p-6">
        <SignInForm />
      </div>
    </div>
  )
}
