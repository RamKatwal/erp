"use client"

import type { Table } from "@tanstack/react-table"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import {
  DataTableToolbar,
  type DataTableFilters,
} from "./data-table-toolbar"
import { DataTableView } from "./data-table-view"
import { type DataTableRowSize } from "./data-table-styles"
import { dataTableFullscreenClassName } from "./use-data-table-fullscreen"

type DataTableCardProps<TData> = {
  table: Table<TData>
  columnCount: number
  searchPlaceholder?: string
  rowSize: DataTableRowSize
  onRowSizeChange: (size: DataTableRowSize) => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
  emptyMessage?: string
  onRowClick?: (row: TData) => void
  /** Optional leading chrome such as status tabs. Omit for the default right-aligned toolbar. */
  leading?: ReactNode
  filters?: DataTableFilters
  /** When false, hides the toolbar Filter control. Defaults to true. */
  showFilter?: boolean
}

export function DataTableCard<TData>({
  table,
  columnCount,
  searchPlaceholder,
  rowSize,
  onRowSizeChange,
  isFullscreen,
  onToggleFullscreen,
  emptyMessage,
  onRowClick,
  leading,
  filters,
  showFilter = true,
}: DataTableCardProps<TData>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-xs",
        dataTableFullscreenClassName(isFullscreen)
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 border-b px-3 py-2.5",
          leading
            ? "lg:flex-row lg:items-center lg:justify-between"
            : "sm:flex-row sm:items-center sm:justify-end"
        )}
      >
        {leading}

        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          rowSize={rowSize}
          onRowSizeChange={onRowSizeChange}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          filters={filters}
          showFilter={showFilter}
        />
      </div>

      <DataTableView
        table={table}
        columnCount={columnCount}
        rowSize={rowSize}
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
      />
    </div>
  )
}
