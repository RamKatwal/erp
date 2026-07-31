export const THEME_COLOR_IDS = [
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "neon",
  "green",
  "emerald",
  "teal",
  "cyan",
  "light-blue",
  "blue",
  "violet-blue",
  "purple",
  "dark-orchid",
  "fuchsia",
  "magenta",
  "rose",
] as const

export type ThemeColorId = (typeof THEME_COLOR_IDS)[number]

/** Legacy IDs from earlier appearance prefs → current ThemeColorId */
export const LEGACY_THEME_COLOR_MAP: Record<string, ThemeColorId> = {
  default: "gray",
  violet: "purple",
}

export const FONT_IDS = ["default", "inter", "roboto"] as const

export type FontId = (typeof FONT_IDS)[number]

export type AppearancePreferences = {
  colorId: ThemeColorId
  fontId: FontId
}

export const DEFAULT_APPEARANCE: AppearancePreferences = {
  colorId: "gray",
  fontId: "default",
}

export const APPEARANCE_STORAGE_KEY = "ibmerp-appearance"
