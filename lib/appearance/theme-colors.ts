import type { ThemeColorId } from "./types"

export type ThemeColorOption = {
  id: ThemeColorId
  label: string
  /** Preview swatch shown in the settings UI */
  swatch: string
}

export const themeColorOptions: ThemeColorOption[] = [
  {
    id: "default",
    label: "Default",
    swatch: "oklch(0.205 0 0)",
  },
  {
    id: "blue",
    label: "Blue",
    swatch: "oklch(0.546 0.245 262.881)",
  },
  {
    id: "green",
    label: "Green",
    swatch: "oklch(0.627 0.194 149.214)",
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "oklch(0.541 0.281 293.009)",
  },
  {
    id: "orange",
    label: "Orange",
    swatch: "oklch(0.646 0.222 41.116)",
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "oklch(0.586 0.253 17.585)",
  },
  {
    id: "teal",
    label: "Teal",
    swatch: "oklch(0.6 0.118 184.704)",
  },
]

export function isThemeColorId(value: unknown): value is ThemeColorId {
  return (
    typeof value === "string" &&
    themeColorOptions.some((option) => option.id === value)
  )
}
