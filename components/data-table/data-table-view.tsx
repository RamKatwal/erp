"use client"

import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { DataTablePagination } from "./data-table-pagination"
import {
  type DataTableRowSize,
  dataTableClassNames,
  getDataTableBodyCellClass,
  getDataTableHeaderCellClass,
} from "./data-table-styles"

const interactiveSelector =
  "button, a, input, textarea, select, label, [role='checkbox'], [role='menuitem'], [data-slot='checkbox'], [data-slot='dropdown-menu-trigger'], [data-slot='button']"

type DataTableViewProps<TData> = {
  table: Table<TData>
  columnCount: number
  className?: string
  tableClassName?: string
  showPagination?: boolean
  emptyMessage?: string
  rowSize?: DataTableRowSize
}

export function DataTableView<TData>({
  table,
  columnCount,
  className,
  tableClassName,
  showPagination = true,
  emptyMessage = "No results found.",
  rowSize = "md",
}: DataTableViewProps<TData>) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      data-slot="data-table"
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <table
          className={cn(dataTableClassNames.table, tableClassName)}
          data-row-size={rowSize}
        >
          <thead className="sticky top-0 z-10">
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
                  onClick={(event) => {
                    const target = event.target as HTMLElement
                    if (target.closest(interactiveSelector)) return
                    row.toggleSelected()
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        getDataTableBodyCellClass(rowSize),
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
                  colSpan={columnCount}
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
