"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AppBrand } from "@/components/app-brand"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { OTPField, OTPHiddenInput, OTPInput } from "@/components/ui/otp-field"
import { Spinner } from "@/components/ui/spinner"
import {
  apiJson,
  saveAuthSessionClient,
  saveOnboardingSessionClient,
} from "@/lib/onboarding/client-session"
import type { AuthSessionData } from "@/lib/onboarding/session-types"
import type { OnboardingSessionData } from "@/lib/onboarding/session-types"
import { resumePathForStatus } from "@/lib/onboarding/status"

const DEMO_OTP = "111111"
const RESEND_SECONDS = 60

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Enter the 6-digit verification code.",
  }),
})

export default function VerificationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")?.trim() || "your email"

  const [isLoading, setIsLoading] = React.useState(false)
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  React.useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.pin !== DEMO_OTP) {
      form.setError("pin", {
        message: "Invalid verification code. Try 111111 for now.",
      })
      return
    }

    setIsLoading(true)
    const emailParam = searchParams.get("email")?.trim() ?? ""

    try {
      const res = await apiJson<{
        auth: AuthSessionData
        session: OnboardingSessionData
      }>("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({ email: emailParam || "user@example.com" }),
      })
      saveAuthSessionClient(res.auth)
      saveOnboardingSessionClient(res.session)
      router.push(resumePathForStatus(res.session.status, res.session.email))
    } catch {
      const planPath = emailParam
        ? `/onboarding/plan?email=${encodeURIComponent(emailParam)}`
        : "/onboarding/plan"
      router.push(planPath)
    } finally {
      setIsLoading(false)
    }
  }

  function handleResend() {
    if (secondsLeft > 0) return
    form.clearErrors("pin")
    form.setValue("pin", "")
    setSecondsLeft(RESEND_SECONDS)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8 bg-background">
      <AppBrand href="/signup" size={32} priority />

      <div className="flex flex-col gap-4">
        <div className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={Mail01Icon} className="size-6" />
          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            ✓
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify Your Email Address
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter the 6-digit verification code sent to your email to verify
            your account.{" "}
            <span className="font-medium text-primary">{email}</span>
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OTPField
                    className="justify-between"
                    value={field.value}
                    validationType="numeric"
                    onValueChange={(value) => {
                      field.onChange(value)
                      if (form.formState.errors.pin) {
                        form.clearErrors("pin")
                      }
                    }}
                    autoFocus
                    size="48"
                  >
                    {Array.from({ length: 6 }).map((_, index) => (
                      <OTPInput key={index} index={index} />
                    ))}
                    <OTPHiddenInput />
                  </OTPField>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="h-10 w-full" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size={18} variant="default" /> : "Verify"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive code?{" "}
            {secondsLeft > 0 ? (
              <span>
                Resend code in{" "}
                <span className="font-medium text-primary">
                  {secondsLeft} sec
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Resend code
              </button>
            )}
          </p>

          <p className="text-sm text-muted-foreground">
            Wrong email?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Go back
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
