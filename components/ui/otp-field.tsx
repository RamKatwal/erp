"use client"

import * as React from "react"
import * as OneTimePasswordFieldPrimitive from "@radix-ui/react-one-time-password-field"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

type SlotSize = NonNullable<VariantProps<typeof otpInputVariants>["size"]>
type OTPContextType = {
  size?: SlotSize
}
type OTPFieldProps = React.ComponentPropsWithoutRef<
  typeof OneTimePasswordFieldPrimitive.Root
> &
  OTPContextType
type OTPInputProps = React.ComponentPropsWithoutRef<
  typeof OneTimePasswordFieldPrimitive.Input
>
type OTPHiddenInputProps = React.ComponentPropsWithoutRef<
  typeof OneTimePasswordFieldPrimitive.HiddenInput
>

const otpInputVariants = cva(
  cn(
    "inline-flex appearance-none items-center justify-center rounded-md border border-input bg-background p-0 text-center font-semibold text-foreground shadow-xs outline-none",
    "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
    "group-has-disabled:cursor-not-allowed group-has-disabled:opacity-50",
    "group-aria-invalid:border-destructive group-aria-invalid:ring-2 group-aria-invalid:ring-destructive/20",
    "[[data-invalid=true]_&]:border-destructive [[data-invalid=true]_&]:ring-2 [[data-invalid=true]_&]:ring-destructive/20"
  ),
  {
    variants: {
      size: {
        "28": "size-7 text-[13px]",
        "32": "size-8 text-sm",
        "36": "size-9 text-sm",
        "40": "size-10 text-sm",
        "44": "size-11 text-base",
        "48": "size-12 text-base",
      },
    },
    defaultVariants: {
      size: "40",
    },
  }
)

const OTPContext = React.createContext<OTPContextType | null>(null)

function useOTPContext() {
  const context = React.useContext(OTPContext)
  if (!context) throw new Error("OTPInput must be used within an OTPField")
  return context
}

function OTPField({
  className,
  children,
  validationType = "numeric",
  size = "40",
  ...props
}: OTPFieldProps) {
  const ctx = React.useMemo(() => ({ size }), [size])
  return (
    <OneTimePasswordFieldPrimitive.Root
      data-slot="otp-field"
      validationType={validationType}
      className={cn(
        "group peer flex flex-nowrap gap-2 has-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <OTPContext.Provider value={ctx}>{children}</OTPContext.Provider>
    </OneTimePasswordFieldPrimitive.Root>
  )
}
OTPField.displayName = "OTPField"

function OTPInput({ className, ...props }: OTPInputProps) {
  const { size } = useOTPContext()
  return (
    <OneTimePasswordFieldPrimitive.Input
      data-slot="otp-input"
      className={cn(otpInputVariants({ size }), className)}
      {...props}
    />
  )
}
OTPInput.displayName = "OTPInput"

function OTPHiddenInput({ className, ...props }: OTPHiddenInputProps) {
  return (
    <OneTimePasswordFieldPrimitive.HiddenInput
      data-slot="otp-hidden-input"
      className={className}
      {...props}
    />
  )
}
OTPHiddenInput.displayName = "OTPHiddenInput"

export { OTPField, OTPInput, OTPHiddenInput }
