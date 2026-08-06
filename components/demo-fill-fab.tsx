"use client"

import { MagicWand01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DemoFillFabProps = {
  label?: string
  onFill: () => void
  className?: string
}

/** Fixed bottom-right control to autofill demo form data while prototyping. */
export function DemoFillFab({
  label = "Fill demo data",
  onFill,
  className,
}: DemoFillFabProps) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={onFill}
      className={cn(
        "fixed right-5 bottom-5 z-50 h-11 gap-2 rounded-full px-4 shadow-lg",
        "md:right-8 md:bottom-8",
        className
      )}
      aria-label={label}
    >
      <HugeiconsIcon icon={MagicWand01Icon} className="size-4 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )
}
