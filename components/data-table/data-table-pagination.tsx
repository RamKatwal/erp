"use client"

import type { Table } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  className?: string
}

const pageSizeOptions = [10, 20, 30, 50]

export function DataTablePagination<TData>({
  table,
  className,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalRows = table.getFilteredRowModel().rows.length
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border bg-muted/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-xs text-muted-foreground tabular-nums">
        {totalRows} {totalRows === 1 ? "row" : "rows"}
        {totalRows > 0 ? (
          <span className="text-muted-foreground/70">
            {" "}
            · {start}-{end}
          </span>
        ) : null}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRightIcon />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
