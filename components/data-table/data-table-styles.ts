import { cn } from "@/lib/utils"

/** Carbon data table row sizes — https://carbondesignsystem.com/components/data-table/style/ */
export type DataTableRowSize = "xs" | "sm" | "md" | "lg" | "xl"

export const dataTableRowSizes: {
  value: DataTableRowSize
  label: string
}[] = [
  { value: "xs", label: "Extra small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra large" },
]

const rowSizeHeightClass: Record<DataTableRowSize, string> = {
  xs: "h-6",
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-14",
}

export const dataTableClassNames = {
  table: "w-full caption-bottom border-collapse text-xs",
  headerRow: "border-b border-border bg-muted/50 text-muted-foreground",
  bodyRow:
    "cursor-pointer border-b border-border bg-card transition-colors hover:bg-muted data-[state=selected]:bg-muted data-[state=selected]:hover:bg-muted/80",
  selectCell: "w-10 px-2 text-center [&_[data-slot=checkbox]]:mx-auto",
  emptyCell: "h-24 px-4 text-center text-muted-foreground",
} as const

export function getDataTableHeaderCellClass(
  rowSize: DataTableRowSize = "md"
) {
  return cn(
    rowSizeHeightClass[rowSize],
    "border-r border-border px-3 text-left text-xs font-medium whitespace-nowrap last:border-r-0",
    rowSize === "xl" ? "align-top pt-4" : "align-middle"
  )
}

export function getDataTableBodyCellClass(rowSize: DataTableRowSize = "md") {
  return cn(
    rowSizeHeightClass[rowSize],
    "border-r border-border px-3 whitespace-nowrap last:border-r-0",
    rowSize === "xl" ? "align-top pt-4" : "align-middle"
  )
}
