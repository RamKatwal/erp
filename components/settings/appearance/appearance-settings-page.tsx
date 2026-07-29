"use client"

import { CheckIcon } from "lucide-react"

import { useAppearance } from "@/components/appearance/appearance-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fontOptions } from "@/lib/appearance/fonts"
import { themeColorOptions } from "@/lib/appearance/theme-colors"

export function AppearanceSettingsPage() {
  const { colorId, fontId, setColorId, setFontId, resetAppearance } =
    useAppearance()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appearance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize the theme color and font used across the workspace.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetAppearance}>
          Reset to defaults
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Theme color</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Applies to buttons, active tabs, focus rings, and tinted hover
            states in the sidebar and tables.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {themeColorOptions.map((option) => {
            const selected = colorId === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setColorId(option.id)}
                className={cn(
                  "group flex w-[6.5rem] flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors",
                  selected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:bg-muted/60"
                )}
                aria-pressed={selected}
              >
                <span
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-full border border-black/10 shadow-sm",
                    option.id === "default" && "dark:border-white/20"
                  )}
                  style={{ backgroundColor: option.swatch }}
                >
                  {selected ? (
                    <CheckIcon
                      className={cn(
                        "size-4",
                        option.id === "default"
                          ? "text-white dark:text-black"
                          : "text-white"
                      )}
                    />
                  ) : null}
                </span>
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-4">
          <span className="mr-2 text-xs text-muted-foreground">Preview</span>
          <Button type="button" size="sm">
            Primary button
          </Button>
          <Button type="button" size="sm" variant="outline">
            Outline
          </Button>
          <Button type="button" size="sm" variant="secondary">
            Secondary
          </Button>
          <span className="inline-flex overflow-hidden rounded-md border">
            <span className="bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              Active tab
            </span>
            <span className="bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Inactive
            </span>
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Font</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the typeface used for the interface. Default keeps the
            current Geist Sans look.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {fontOptions.map((option) => {
            const selected = fontId === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFontId(option.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:bg-muted/60"
                )}
                aria-pressed={selected}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{option.label}</span>
                  {selected ? (
                    <CheckIcon className="size-4 text-primary" />
                  ) : null}
                </span>
                <span
                  className="text-2xl tracking-tight text-foreground"
                  style={{ fontFamily: option.previewFamily }}
                >
                  Aa Bb Cc
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
