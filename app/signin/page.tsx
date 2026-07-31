import SignInForm from "@/components/sign-in-form"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default function SignInPage() {
  return (
    <div className="flex min-h-svh bg-background">
      <div className="flex w-full items-center justify-center p-5 md:w-1/2 md:p-6">
        <SignInForm />
      </div>
      <div className="hidden h-svh md:flex md:w-1/2">
        <TestimonialCarousel />
      </div>
    </div>
  )
}
