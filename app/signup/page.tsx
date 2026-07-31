import Image from "next/image"

import Logo from "@/components/radian-logo"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh">
      <div className="hidden w-1/2 p-6 md:block">
        <div className="relative h-full min-h-[calc(100svh-3rem)] w-full overflow-hidden rounded-2xl bg-[url('https://dev.radianos.com/blocks/illustration-gradient.jpg')] bg-cover bg-top-left bg-no-repeat pl-30 pt-32.5">
          <div className="flex max-w-120 flex-col gap-4 text-white">
            <Logo />
            <h4 className="text-2xl font-semibold tracking-tight">
              Start creating more designs with Radian
            </h4>
            <p className="text-base text-white">
              Create a free account and get full access to all features for
              30-days. No credit card needed.
            </p>
          </div>
          <div className="absolute top-[50vh] right-0 h-max w-full pl-30">
            <Image
              src="https://dev.radianos.com/blocks/dashboard.png"
              alt=""
              className="w-full object-cover"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 items-center justify-center overflow-y-auto p-5 md:w-1/2">
        <SignupForm />
      </div>
    </div>
  )
}
