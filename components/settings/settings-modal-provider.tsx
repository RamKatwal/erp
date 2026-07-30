"use client"

import * as React from "react"

import type { SettingsModalSection } from "@/config/settings-modal-navigation"
import { isTypingTarget } from "@/lib/keyboard/utils"

type SettingsModalContextValue = {
  open: boolean
  section: SettingsModalSection
  setOpen: (open: boolean) => void
  setSection: (section: SettingsModalSection) => void
  openSettings: (section?: SettingsModalSection) => void
  closeSettings: () => void
}

const SettingsModalContext =
  React.createContext<SettingsModalContextValue | null>(null)

export function SettingsModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [section, setSection] =
    React.useState<SettingsModalSection>("profile")

  const openSettings = React.useCallback(
    (nextSection: SettingsModalSection = "profile") => {
      setSection(nextSection)
      setOpen(true)
    },
    []
  )

  const closeSettings = React.useCallback(() => {
    setOpen(false)
  }, [])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return

      const mod = event.metaKey || event.ctrlKey
      if (!mod || event.shiftKey || event.altKey) return
      if (isTypingTarget(event.target)) return

      if (event.key === ",") {
        event.preventDefault()
        openSettings("profile")
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openSettings])

  const value = React.useMemo(
    () => ({
      open,
      section,
      setOpen,
      setSection,
      openSettings,
      closeSettings,
    }),
    [open, section, openSettings, closeSettings]
  )

  return (
    <SettingsModalContext.Provider value={value}>
      {children}
    </SettingsModalContext.Provider>
  )
}

export function useSettingsModal() {
  const ctx = React.useContext(SettingsModalContext)
  if (!ctx) {
    throw new Error("useSettingsModal must be used within SettingsModalProvider")
  }
  return ctx
}

export function useSettingsModalOptional() {
  return React.useContext(SettingsModalContext)
}
