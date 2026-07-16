"use client"

import type { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { DataTablePagination } from "./data-table-pagination"

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
                  colSpan={columnCount}
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
