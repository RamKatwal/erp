"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { filterNepalCities, NEPAL_CITIES } from "@/lib/onboarding/nepal-cities"
import { cn } from "@/lib/utils"

type CityLocationInputProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  invalid?: boolean
  placeholder?: string
  className?: string
  "data-row-index"?: number
  "data-col"?: string
}

export function CityLocationInput({
  value,
  onChange,
  disabled = false,
  invalid = false,
  placeholder = "Search or type a city",
  className,
  "data-row-index": dataRowIndex,
  "data-col": dataCol,
}: CityLocationInputProps) {
  const [open, setOpen] = React.useState(false)
  const [highlight, setHighlight] = React.useState(0)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()

  const suggestions = filterNepalCities(value, 10)
  const trimmed = value.trim()
  const canAddCustom =
    trimmed.length > 0 &&
    !NEPAL_CITIES.some((c) => c.toLowerCase() === trimmed.toLowerCase())

  React.useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  React.useEffect(() => {
    setHighlight(0)
  }, [value, open])

  function selectCity(city: string) {
    onChange(city)
    setOpen(false)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true)
      return
    }
    if (!open) return

    const options = [
      ...(canAddCustom ? [`__custom__:${trimmed}`] : []),
      ...suggestions,
    ]

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlight((h) => Math.min(h + 1, Math.max(0, options.length - 1)))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (event.key === "Enter" && options[highlight]) {
      event.preventDefault()
      const picked = options[highlight]!
      selectCity(
        picked.startsWith("__custom__:")
          ? picked.slice("__custom__:".length)
          : picked
      )
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <Input
        data-row-index={dataRowIndex}
        data-col={dataCol}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid}
        disabled={disabled}
        className={className}
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
      {open && !disabled && (suggestions.length > 0 || canAddCustom) ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+2px)] left-0 z-40 max-h-48 w-full min-w-[12rem] overflow-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
        >
          {canAddCustom ? (
            <li
              role="option"
              aria-selected={highlight === 0}
              className={cn(
                "cursor-pointer px-2 py-1.5 text-xs",
                highlight === 0 ? "bg-accent text-accent-foreground" : "hover:bg-muted"
              )}
              onMouseEnter={() => setHighlight(0)}
              onMouseDown={(event) => {
                event.preventDefault()
                selectCity(trimmed)
              }}
            >
              Use &ldquo;{trimmed}&rdquo;
            </li>
          ) : null}
          {suggestions.map((city, index) => {
            const optionIndex = (canAddCustom ? 1 : 0) + index
            return (
              <li
                key={city}
                role="option"
                aria-selected={highlight === optionIndex}
                className={cn(
                  "cursor-pointer px-2 py-1.5 text-xs",
                  highlight === optionIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onMouseEnter={() => setHighlight(optionIndex)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  selectCity(city)
                }}
              >
                {city}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
