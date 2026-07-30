import type { ThemeColorId } from "./types"

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
    id: "default",
    label: "Graphite",
    description: "Neutral charcoal accent",
    swatch: "oklch(0.205 0 0)",
    surface: "oklch(0.92 0 0)",
  },
  {
    id: "blue",
    label: "Ocean",
    description: "Clear blue for focus and links",
    swatch: "oklch(0.546 0.245 262.881)",
    surface: "oklch(0.93 0.04 262)",
  },
  {
    id: "green",
    label: "Forest",
    description: "Calm green for success states",
    swatch: "oklch(0.627 0.194 149.214)",
    surface: "oklch(0.94 0.04 149)",
  },
  {
    id: "violet",
    label: "Amethyst",
    description: "Soft violet for creative workspaces",
    swatch: "oklch(0.541 0.281 293.009)",
    surface: "oklch(0.94 0.04 293)",
  },
  {
    id: "orange",
    label: "Amber",
    description: "Warm orange for energetic interfaces",
    swatch: "oklch(0.646 0.222 41.116)",
    surface: "oklch(0.95 0.04 41)",
  },
  {
    id: "rose",
    label: "Rose",
    description: "Bold rose for high-contrast accents",
    swatch: "oklch(0.586 0.253 17.585)",
    surface: "oklch(0.95 0.03 17)",
  },
  {
    id: "teal",
    label: "Lagoon",
    description: "Cool teal for calm dashboards",
    swatch: "oklch(0.6 0.118 184.704)",
    surface: "oklch(0.94 0.03 184)",
  },
]

export function getThemeColorOption(id: ThemeColorId) {
  return themeColorOptions.find((option) => option.id === id)
}

export function isThemeColorId(value: unknown): value is ThemeColorId {
  return (
    typeof value === "string" &&
    themeColorOptions.some((option) => option.id === value)
  )
}
