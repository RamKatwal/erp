"use client"

import * as React from "react"
import { type ColumnDef, flexRender } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { DataTablePagination } from "./data-table-pagination"
import { useDataTable } from "./use-data-table"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  globalFilterFn?: (
    row: { original: TData },
    columnId: string,
    filterValue: string
  ) => boolean
  pageSize?: number
  className?: string
  tableClassName?: string
  showPagination?: boolean
  emptyMessage?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilterFn,
  pageSize = 10,
  className,
  tableClassName,
  showPagination = true,
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  const table = useDataTable({
    data,
    columns,
    pageSize,
    globalFilterFn,
  })

  return (
    <div className={cn("flex flex-col", className)} data-slot="data-table">
      <div className="overflow-x-auto">
        <table className={cn("w-full caption-bottom text-xs", tableClassName)}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b bg-muted/40 text-muted-foreground"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-9 px-4 text-left align-middle font-medium whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 align-middle whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 px-4 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination ? <DataTablePagination table={table} /> : null}
    </div>
  )
}

export { DataTableView } from "./data-table-view"
export { DataTableColumnHeader } from "./data-table-column-header"
export { DataTablePagination } from "./data-table-pagination"
export { DataTableToolbar } from "./data-table-toolbar"
export { useDataTable } from "./use-data-table"
export type { ColumnDef }
