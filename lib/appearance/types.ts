export const THEME_COLOR_IDS = [
  "default",
  "blue",
  "green",
  "violet",
  "orange",
  "rose",
  "teal",
] as const

export type ThemeColorId = (typeof THEME_COLOR_IDS)[number]

export const FONT_IDS = ["default", "inter", "roboto"] as const

export type FontId = (typeof FONT_IDS)[number]

export type AppearancePreferences = {
  colorId: ThemeColorId
  fontId: FontId
}

export const DEFAULT_APPEARANCE: AppearancePreferences = {
  colorId: "default",
  fontId: "default",
}

export const APPEARANCE_STORAGE_KEY = "ibmerp-appearance"
