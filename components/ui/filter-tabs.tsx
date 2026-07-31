"use client"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { cn } from "@/lib/utils"

export type FilterTabItem<T extends string = string> = {
  value: T
  label: string
  count?: number
}

type FilterTabsProps<T extends string> = {
  items: readonly FilterTabItem<T>[]
  value: T
  onValueChange: (value: T) => void
  className?: string
}

export function FilterTabs<T extends string>({
  items,
  value,
  onValueChange,
  className,
}: FilterTabsProps<T>) {
  return (
    <ButtonGroup role="tablist" className={cn(className)}>
      {items.map((item) => {
        const isActive = value === item.value

        return (
          <Button
            key={item.value}
            type="button"
            role="tab"
            size="sm"
            variant={isActive ? "default" : "outline"}
            aria-selected={isActive}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
            {item.count != null ? (
              <span
                className={cn(
                  "tabular-nums",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {item.count}
              </span>
            ) : null}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
