"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckboxProps = Omit<
  React.ComponentProps<"button">,
  "onChange" | "checked"
> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-slot="checkbox"
      disabled={disabled}
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-background shadow-xs transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        checked && "border-primary bg-primary text-primary-foreground",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {checked ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
    </button>
  )
}

export { Checkbox }
