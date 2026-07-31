"use client"

import type { Table } from "@tanstack/react-table"
import {
  CheckIcon,
  FilterIcon,
  Maximize2Icon,
  Minimize2Icon,
  Rows3Icon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  type DataTableRowSize,
  dataTableRowSizes,
} from "./data-table-styles"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  className?: string
  rowSize?: DataTableRowSize
  onRowSizeChange?: (size: DataTableRowSize) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  className,
  rowSize = "md",
  onRowSizeChange,
  isFullscreen = false,
  onToggleFullscreen,
}: DataTableToolbarProps<TData>) {
  const globalFilter = (table.getState().globalFilter as string) ?? ""

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-full max-w-[220px]">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          data-page-search="true"
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 pl-9 text-xs"
        />
      </div>

      <ButtonGroup>
        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger
              render={
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Row size"
                    />
                  }
                />
              }
            >
              <Rows3Icon />
            </DropdownMenuTrigger>
            <TooltipContent>Row size</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Row size</DropdownMenuLabel>
              {dataTableRowSizes.map((size) => (
                <DropdownMenuItem
                  key={size.value}
                  onClick={() => onRowSizeChange?.(size.value)}
                >
                  <span>{size.label}</span>
                  {rowSize === size.value ? (
                    <CheckIcon className="ml-auto size-4" />
                  ) : (
                    <span className="ml-auto size-4" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
                aria-pressed={isFullscreen}
                onClick={onToggleFullscreen}
              />
            }
          >
            {isFullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm">
          <FilterIcon />
          Filter
        </Button>
      </ButtonGroup>
    </div>
  )
}
