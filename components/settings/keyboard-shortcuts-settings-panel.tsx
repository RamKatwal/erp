"use client"

import { ShortcutsBrowser } from "@/components/keyboard/shortcuts-browser"
import { cn } from "@/lib/utils"

type KeyboardShortcutsSettingsPanelProps = {
  className?: string
}

export function KeyboardShortcutsSettingsPanel({
  className,
}: KeyboardShortcutsSettingsPanelProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <ShortcutsBrowser />
    </div>
  )
}
