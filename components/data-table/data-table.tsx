"use client"

import * as React from "react"
import { type ColumnDef, flexRender } from "@tanstack/react-table"

import "@/types/data-table"
import { cn } from "@/lib/utils"

import { DataTablePagination } from "./data-table-pagination"
import {
  type DataTableRowSize,
  dataTableClassNames,
  getDataTableBodyCellClass,
  getDataTableHeaderCellClass,
} from "./data-table-styles"
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
  rowSize?: DataTableRowSize
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
  rowSize = "md",
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
        <table
          className={cn(dataTableClassNames.table, tableClassName)}
          data-row-size={rowSize}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={dataTableClassNames.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      getDataTableHeaderCellClass(rowSize),
                      header.column.id === "select" &&
                        dataTableClassNames.selectCell
                    )}
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
                  className={dataTableClassNames.bodyRow}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        getDataTableBodyCellClass(
                          rowSize,
                          cell.column.columnDef.meta?.wrapCell
                        ),
                        cell.column.id === "select" &&
                          dataTableClassNames.selectCell
                      )}
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
                  className={dataTableClassNames.emptyCell}
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
export { DataTableCard } from "./data-table-card"
export { DataTableColumnHeader } from "./data-table-column-header"
export { DataTablePagination } from "./data-table-pagination"
export { DataTableToolbar } from "./data-table-toolbar"
export { useDataTable } from "./use-data-table"
export {
  dataTableFullscreenClassName,
  useDataTableFullscreen,
} from "./use-data-table-fullscreen"
export type { DataTableRowSize } from "./data-table-styles"
export type {
  DataTableFilterOption,
  DataTableFilters,
} from "./data-table-toolbar"
export type { ColumnDef }
