"use client"

import type { Table } from "@tanstack/react-table"
import {
  FilterIcon,
  LayoutGridIcon,
  ListIcon,
  Maximize2Icon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  className?: string
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  className,
}: DataTableToolbarProps<TData>) {
  const globalFilter = (table.getState().globalFilter as string) ?? ""

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-full max-w-[220px]">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-9 pl-9"
        />
      </div>

      <div className="flex items-center rounded-md border border-border p-0.5">
        <Button variant="ghost" size="icon-sm" aria-label="Grid view">
          <LayoutGridIcon />
        </Button>
        <Button variant="secondary" size="icon-sm" aria-label="List view">
          <ListIcon />
        </Button>
      </div>

      <Button variant="outline" size="icon-sm" aria-label="Full screen">
        <Maximize2Icon />
      </Button>

      <Button variant="outline">
        <FilterIcon />
        Filter
      </Button>
    </div>
  )
}
