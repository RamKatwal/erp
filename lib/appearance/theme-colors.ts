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

/** Swatches match Radian color primitives (utility.css). */
export const themeColorOptions: ThemeColorOption[] = [
  {
    id: "gray",
    label: "Gray (Default)",
    description: "Neutral charcoal primary",
    swatch: "oklch(0.2314 0.0078 274.6)",
    surface: "oklch(0.9677 0.0027 286.35)",
  },
  {
    id: "red",
    label: "Red",
    description: "Bold red accent",
    swatch: "oklch(63.994% 0.22 26.022)",
    surface: "oklch(0.956 0.02 17.516)",
  },
  {
    id: "orange",
    label: "Orange",
    description: "Warm orange accent",
    swatch: "oklch(0.685 0.186 43.133)",
    surface: "oklch(0.961 0.022 50.377)",
  },
  {
    id: "amber",
    label: "Amber",
    description: "Golden amber accent",
    swatch: "oklch(0.802 0.171 73.267)",
    surface: "oklch(0.976 0.024 83.417)",
  },
  {
    id: "yellow",
    label: "Yellow",
    description: "Bright yellow accent",
    swatch: "oklch(0.9 0.174 96.856)",
    surface: "oklch(0.985 0.028 97.622)",
  },
  {
    id: "neon",
    label: "Neon",
    description: "Electric lime accent",
    swatch: "oklch(0.919 0.231 127.834)",
    surface: "oklch(0.986 0.035 122.616)",
  },
  {
    id: "green",
    label: "Green",
    description: "Classic green accent",
    swatch: "oklch(0.654 0.216 142.602)",
    surface: "oklch(0.977 0.027 145.361)",
  },
  {
    id: "emerald",
    label: "Emerald",
    description: "Jewel emerald accent",
    swatch: "oklch(0.633 0.17 148.732)",
    surface: "oklch(0.979 0.023 156.788)",
  },
  {
    id: "teal",
    label: "Teal",
    description: "Cool teal accent",
    swatch: "oklch(0.644 0.125 169.297)",
    surface: "oklch(0.98 0.028 179.036)",
  },
  {
    id: "cyan",
    label: "Cyan",
    description: "Bright cyan accent",
    swatch: "oklch(0.656 0.109 194.818)",
    surface: "oklch(0.982 0.026 196.729)",
  },
  {
    id: "light-blue",
    label: "Light Blue",
    description: "Soft sky blue accent",
    swatch: "oklch(0.61 0.203 255.637)",
    surface: "oklch(0.966 0.014 246.134)",
  },
  {
    id: "blue",
    label: "Blue",
    description: "Royal blue accent",
    swatch: "oklch(0.534 0.222 272.272)",
    surface: "oklch(0.955 0.018 281.902)",
  },
  {
    id: "violet-blue",
    label: "Violet Blue",
    description: "Radian brand violet",
    swatch: "oklch(0.528 0.253 282.555)",
    surface: "oklch(0.965 0.016 295.276)",
  },
  {
    id: "purple",
    label: "Purple",
    description: "Vibrant purple accent",
    swatch: "oklch(0.556 0.252 292.999)",
    surface: "oklch(0.966 0.016 301.95)",
  },
  {
    id: "dark-orchid",
    label: "Dark Orchid",
    description: "Deep orchid accent",
    swatch: "oklch(0.623 0.28 310.693)",
    surface: "oklch(0.967 0.023 314.712)",
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    description: "Bright fuchsia accent",
    swatch: "oklch(0.69 0.262 327.962)",
    surface: "oklch(0.97 0.028 325.792)",
  },
  {
    id: "magenta",
    label: "Magenta",
    description: "Hot magenta accent",
    swatch: "oklch(0.619 0.251 347.256)",
    surface: "oklch(0.971 0.017 336.187)",
  },
  {
    id: "rose",
    label: "Rose",
    description: "Deep rose accent",
    swatch: "oklch(0.651 0.221 6.174)",
    surface: "oklch(0.96 0.018 354.12)",
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
