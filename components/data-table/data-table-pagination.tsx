"use client"

import type { Table } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  className?: string
}

const pageSizeOptions = [10, 20, 30, 50]

function PageNavButton({
  label,
  icon: Icon,
  onClick,
  disabled,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
  disabled: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

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
          <PageNavButton
            label="First page"
            icon={ChevronsLeftIcon}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
          <PageNavButton
            label="Previous page"
            icon={ChevronLeftIcon}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <PageNavButton
            label="Next page"
            icon={ChevronRightIcon}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
          <PageNavButton
            label="Last page"
            icon={ChevronsRightIcon}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
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
