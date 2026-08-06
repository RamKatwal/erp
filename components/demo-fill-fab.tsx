"use client"

import * as React from "react"
import { MagicWand01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMac } from "@/hooks/use-is-mac"
import { formatShortcutParts } from "@/lib/keyboard/utils"
import { cn } from "@/lib/utils"

const DEMO_FILL_SHORTCUT = ["Mod", "Shift", "D"] as const

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
  const isMac = useIsMac()
  const shortcutLabel = formatShortcutParts([...DEMO_FILL_SHORTCUT], isMac)
  const onFillRef = React.useRef(onFill)

  React.useEffect(() => {
    onFillRef.current = onFill
  }, [onFill])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey
      if (!mod || !event.shiftKey) return
      if (event.key.toLowerCase() !== "d") return
      if (event.altKey || event.repeat) return

      event.preventDefault()
      onFillRef.current()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              size="icon-sm"
              onClick={onFill}
              className={cn(
                "fixed right-5 bottom-5 z-50 rounded-full shadow-lg",
                "md:right-8 md:bottom-8",
                className
              )}
              aria-label={`${label} (${shortcutLabel})`}
            />
          }
        >
          <HugeiconsIcon icon={MagicWand01Icon} className="size-4 shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="left" className="flex items-center gap-1.5">
          <span>{label}</span>
          <kbd
            data-slot="kbd"
            className="pointer-events-none inline-flex h-5 items-center rounded border border-background/20 bg-background/15 px-1.5 font-mono text-[10px] font-medium text-background"
          >
            {shortcutLabel}
          </kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
