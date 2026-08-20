import { cn } from "@/lib/utils"

/** Row density tokens. Medium matches the invoices table (text-sm, ~48px). */
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

const rowSizeMinHeightClass: Record<DataTableRowSize, string> = {
  xs: "min-h-8",
  sm: "min-h-10",
  md: "min-h-12",
  lg: "min-h-14",
  xl: "min-h-16",
}

const rowSizePaddingClass: Record<DataTableRowSize, string> = {
  xs: "px-3",
  sm: "px-3 py-0.5",
  md: "px-4 py-1",
  lg: "px-4 py-1.5",
  xl: "px-4 py-2",
}

export const dataTableClassNames = {
  table: "w-full caption-bottom border-collapse font-sans text-sm",
  headerRow: "border-b border-border bg-muted/40 text-muted-foreground",
  bodyRow:
    "border-b border-border bg-card transition-colors hover:bg-muted data-[state=selected]:bg-muted data-[state=selected]:hover:bg-muted/80",
  selectCell: "w-10 px-2 text-center [&_[data-slot=checkbox]]:mx-auto",
  emptyCell: "h-24 px-4 text-center text-sm text-muted-foreground",
} as const

export function getDataTableHeaderCellClass(
  rowSize: DataTableRowSize = "md"
) {
  return cn(
    rowSizeMinHeightClass[rowSize],
    rowSizePaddingClass[rowSize],
    "border-r border-border text-left text-xs font-medium whitespace-nowrap last:border-r-0",
    rowSize === "xl" ? "align-top" : "align-middle"
  )
}

export function getDataTableBodyCellClass(
  rowSize: DataTableRowSize = "md",
  wrap = false
) {
  return cn(
    rowSizeMinHeightClass[rowSize],
    rowSizePaddingClass[rowSize],
    "border-r border-border last:border-r-0",
    wrap
      ? "align-middle whitespace-normal"
      : "align-middle whitespace-nowrap",
    rowSize === "xl" && !wrap ? "align-top" : null
  )
}
