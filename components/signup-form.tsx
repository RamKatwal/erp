"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { GithubIcon } from "@/components/github-icon"
import { GoogleIcon } from "@/components/google-icon"
import Logo from "@/components/radian-logo"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
})

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  function togglePasswordVisibility(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setShowPassword((prev) => !prev)
  }

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 800)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-8 bg-background">
      <div className="flex flex-col gap-6">
        <Logo />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="firstName"
                          autoComplete="given-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="lastName"
                          autoComplete="family-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        id="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="peer pr-9"
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className={cn(
                            "absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground",
                            "cursor-pointer hover:text-foreground",
                            "peer-disabled:pointer-events-none peer-disabled:opacity-50"
                          )}
                          onMouseDown={togglePasswordVisibility}
                        >
                          <HugeiconsIcon
                            icon={showPassword ? EyeIcon : ViewOffSlashIcon}
                            className="size-4"
                          />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Spinner size={18} variant="default" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex min-w-0 items-center gap-2">
          <Divider className="min-w-0 flex-1" />
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            Or continue with
          </span>
          <Divider className="min-w-0 flex-1" />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-2 gap-3">
            <Button variant="outline" className="min-w-0" type="button">
              <GoogleIcon className="size-4 shrink-0" />
              <span className="truncate">Google</span>
            </Button>
            <Button variant="outline" className="min-w-0" type="button">
              <GithubIcon className="size-4 shrink-0" />
              <span className="truncate">Github</span>
            </Button>
          </div>
          <p className="text-[13px] text-muted-foreground">
            By signing up, you agree to Radian&apos;s{" "}
            <Link
              href="#"
              className="text-[13px] font-medium text-primary underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-[13px] font-medium text-primary underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
