import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  type AppearancePreferences,
} from "./types"
import { isFontId } from "./fonts"
import { isThemeColorId } from "./theme-colors"

export function readAppearancePreferences(): AppearancePreferences {
  if (typeof window === "undefined") {
    return DEFAULT_APPEARANCE
  }

  try {
    const saved = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
    if (!saved) {
      return DEFAULT_APPEARANCE
    }

    const parsed = JSON.parse(saved) as Partial<AppearancePreferences>
    return {
      colorId: isThemeColorId(parsed.colorId)
        ? parsed.colorId
        : DEFAULT_APPEARANCE.colorId,
      fontId: isFontId(parsed.fontId) ? parsed.fontId : DEFAULT_APPEARANCE.fontId,
    }
  } catch {
    return DEFAULT_APPEARANCE
  }
}

export function saveAppearancePreferences(
  preferences: AppearancePreferences
) {
  window.localStorage.setItem(
    APPEARANCE_STORAGE_KEY,
    JSON.stringify(preferences)
  )
}

export function applyAppearanceToDocument(
  preferences: AppearancePreferences
) {
  const root = document.documentElement

  if (preferences.colorId === "default") {
    root.removeAttribute("data-theme-color")
  } else {
    root.setAttribute("data-theme-color", preferences.colorId)
  }

  if (preferences.fontId === "default") {
    root.removeAttribute("data-font")
  } else {
    root.setAttribute("data-font", preferences.fontId)
  }
}
