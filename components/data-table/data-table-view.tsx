"use client"

import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { DataTablePagination } from "./data-table-pagination"
import { dataTableClassNames } from "./data-table-styles"

type DataTableViewProps<TData> = {
  table: Table<TData>
  columnCount: number
  className?: string
  tableClassName?: string
  showPagination?: boolean
  emptyMessage?: string
}

export function DataTableView<TData>({
  table,
  columnCount,
  className,
  tableClassName,
  showPagination = true,
  emptyMessage = "No results found.",
}: DataTableViewProps<TData>) {
  return (
    <div className={cn("flex flex-col", className)} data-slot="data-table">
      <div className="overflow-x-auto">
        <table
          className={cn(dataTableClassNames.table, tableClassName)}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={dataTableClassNames.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      dataTableClassNames.headerCell,
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
                        dataTableClassNames.bodyCell,
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
