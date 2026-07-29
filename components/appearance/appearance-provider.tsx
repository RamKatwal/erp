"use client"

import * as React from "react"

import {
  applyAppearanceToDocument,
  readAppearancePreferences,
  saveAppearancePreferences,
} from "@/lib/appearance/storage"
import {
  DEFAULT_APPEARANCE,
  type AppearancePreferences,
  type FontId,
  type ThemeColorId,
} from "@/lib/appearance/types"

type AppearanceContextValue = AppearancePreferences & {
  setColorId: (colorId: ThemeColorId) => void
  setFontId: (fontId: FontId) => void
  resetAppearance: () => void
}

const AppearanceContext = React.createContext<AppearanceContextValue | null>(
  null
)

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [preferences, setPreferences] =
    React.useState<AppearancePreferences>(DEFAULT_APPEARANCE)

  React.useEffect(() => {
    const saved = readAppearancePreferences()
    setPreferences(saved)
    applyAppearanceToDocument(saved)
  }, [])

  const setColorId = (colorId: ThemeColorId) => {
    const next = { ...preferences, colorId }
    setPreferences(next)
    applyAppearanceToDocument(next)
    saveAppearancePreferences(next)
  }

  const setFontId = (fontId: FontId) => {
    const next = { ...preferences, fontId }
    setPreferences(next)
    applyAppearanceToDocument(next)
    saveAppearancePreferences(next)
  }

  const resetAppearance = () => {
    setPreferences(DEFAULT_APPEARANCE)
    applyAppearanceToDocument(DEFAULT_APPEARANCE)
    saveAppearancePreferences(DEFAULT_APPEARANCE)
  }

  return (
    <AppearanceContext.Provider
      value={{
        ...preferences,
        setColorId,
        setFontId,
        resetAppearance,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = React.useContext(AppearanceContext)
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider")
  }
  return context
}
