"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  className?: string
  pageSizeOptions?: number[]
}

const defaultPageSizeOptions = [5, 10, 20, 30, 50]

const ELLIPSIS = "ellipsis" as const

type PageItem = number | typeof ELLIPSIS

/** First page, last page, and the current page with one sibling on each side. */
function getPageItems(currentPage: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const start = Math.max(2, Math.min(currentPage - 1, pageCount - 4))
  const end = Math.min(pageCount - 1, Math.max(currentPage + 1, 5))

  const items: PageItem[] = [1]
  if (start > 2) items.push(ELLIPSIS)
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < pageCount - 1) items.push(ELLIPSIS)
  items.push(pageCount)

  return items
}

const pageButtonClass =
  "inline-flex h-7 min-w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent px-1 text-xs font-medium tabular-nums transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5"

export function DataTablePagination<TData>({
  table,
  className,
  pageSizeOptions = defaultPageSizeOptions,
}: DataTablePaginationProps<TData>) {
  const pageSizeId = React.useId()
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalRows)
  const pageItems = getPageItems(pageIndex + 1, pageCount)
  const sizeOptions = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b)

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border bg-muted/20 px-4 py-2.5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <label htmlFor={pageSizeId} className="text-xs text-muted-foreground">
          Rows per page
        </label>
        <div className="relative">
          <select
            id={pageSizeId}
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-7 cursor-pointer appearance-none rounded-md border border-border bg-background pr-6 pl-2 text-xs tabular-nums outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground tabular-nums">
          {start} - {end} of {totalRows}
        </p>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              pageButtonClass,
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <ChevronLeftIcon />
          </button>

          {pageItems.map((item, index) =>
            item === ELLIPSIS ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden
                className="inline-flex size-7 items-center justify-center text-xs text-muted-foreground"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === pageIndex + 1 ? "page" : undefined}
                onClick={() => table.setPageIndex(item - 1)}
                className={cn(
                  pageButtonClass,
                  item === pageIndex + 1
                    ? "border-border bg-background text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              pageButtonClass,
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
