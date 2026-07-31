import {
  LEGACY_THEME_COLOR_MAP,
  THEME_COLOR_IDS,
  type ThemeColorId,
} from "./types"

export type ThemeColorOption = {
  id: ThemeColorId
  label: string
  description: string
  /** Primary accent shown in the settings swatch */
  swatch: string
  /** Softer companion tone for the dual-tone preview */
  surface: string
}

export const themeColorOptions: ThemeColorOption[] = [
  {
    id: "gray",
    label: "Gray (Default)",
    description: "Neutral charcoal primary",
    swatch: "oklch(0.205 0 0)",
    surface: "oklch(0.92 0 0)",
  },
  {
    id: "red",
    label: "Red",
    description: "Bold red accent",
    swatch: "oklch(0.55 0.22 25)",
    surface: "oklch(0.94 0.04 25)",
  },
  {
    id: "orange",
    label: "Orange",
    description: "Warm orange accent",
    swatch: "oklch(0.65 0.19 45)",
    surface: "oklch(0.94 0.05 45)",
  },
  {
    id: "amber",
    label: "Amber",
    description: "Golden amber accent",
    swatch: "oklch(0.72 0.16 75)",
    surface: "oklch(0.95 0.05 75)",
  },
  {
    id: "yellow",
    label: "Yellow",
    description: "Bright yellow accent",
    swatch: "oklch(0.80 0.16 95)",
    surface: "oklch(0.96 0.05 95)",
  },
  {
    id: "neon",
    label: "Neon",
    description: "Electric lime accent",
    swatch: "oklch(0.75 0.22 130)",
    surface: "oklch(0.95 0.06 130)",
  },
  {
    id: "green",
    label: "Green",
    description: "Classic green accent",
    swatch: "oklch(0.55 0.17 145)",
    surface: "oklch(0.94 0.04 145)",
  },
  {
    id: "emerald",
    label: "Emerald",
    description: "Jewel emerald accent",
    swatch: "oklch(0.55 0.14 160)",
    surface: "oklch(0.94 0.04 160)",
  },
  {
    id: "teal",
    label: "Teal",
    description: "Cool teal accent",
    swatch: "oklch(0.52 0.10 180)",
    surface: "oklch(0.94 0.035 180)",
  },
  {
    id: "cyan",
    label: "Cyan",
    description: "Bright cyan accent",
    swatch: "oklch(0.60 0.12 200)",
    surface: "oklch(0.94 0.04 200)",
  },
  {
    id: "light-blue",
    label: "Light Blue",
    description: "Soft sky blue accent",
    swatch: "oklch(0.62 0.14 230)",
    surface: "oklch(0.94 0.04 230)",
  },
  {
    id: "blue",
    label: "Blue",
    description: "Royal blue accent",
    swatch: "oklch(0.52 0.22 255)",
    surface: "oklch(0.94 0.04 255)",
  },
  {
    id: "violet-blue",
    label: "Violet Blue",
    description: "Indigo accent",
    swatch: "oklch(0.49 0.24 264)",
    surface: "oklch(0.94 0.04 264)",
  },
  {
    id: "purple",
    label: "Purple",
    description: "Vibrant purple accent",
    swatch: "oklch(0.50 0.24 300)",
    surface: "oklch(0.94 0.045 300)",
  },
  {
    id: "dark-orchid",
    label: "Dark Orchid",
    description: "Deep orchid accent",
    swatch: "oklch(0.52 0.24 315)",
    surface: "oklch(0.94 0.045 315)",
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    description: "Bright fuchsia accent",
    swatch: "oklch(0.55 0.26 330)",
    surface: "oklch(0.94 0.05 330)",
  },
  {
    id: "magenta",
    label: "Magenta",
    description: "Hot magenta accent",
    swatch: "oklch(0.55 0.24 350)",
    surface: "oklch(0.94 0.05 350)",
  },
  {
    id: "rose",
    label: "Rose",
    description: "Deep rose accent",
    swatch: "oklch(0.55 0.22 15)",
    surface: "oklch(0.94 0.045 15)",
  },
]

export function getThemeColorOption(id: ThemeColorId) {
  return themeColorOptions.find((option) => option.id === id)
}

export function resolveThemeColorId(value: unknown): ThemeColorId | null {
  if (typeof value !== "string") return null
  if ((THEME_COLOR_IDS as readonly string[]).includes(value)) {
    return value as ThemeColorId
  }
  return LEGACY_THEME_COLOR_MAP[value] ?? null
}

export function isThemeColorId(value: unknown): value is ThemeColorId {
  return (
    typeof value === "string" &&
    (THEME_COLOR_IDS as readonly string[]).includes(value)
  )
}
