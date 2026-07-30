import type { FontId } from "./types"

export type FontOption = {
  id: FontId
  label: string
  description: string
  /** CSS font-family preview for the settings UI */
  previewFamily: string
}

export const fontOptions: FontOption[] = [
  {
    id: "default",
    label: "Geist",
    description: "Modern product sans — default look",
    previewFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "inter",
    label: "Inter",
    description: "Clean, highly legible UI typeface",
    previewFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "roboto",
    label: "Roboto",
    description: "Neutral geometric sans for dense UIs",
    previewFamily: "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
  },
]

export function getFontOption(id: FontId) {
  return fontOptions.find((option) => option.id === id)
}

export function isFontId(value: unknown): value is FontId {
  return (
    typeof value === "string" &&
    fontOptions.some((option) => option.id === value)
  )
}
