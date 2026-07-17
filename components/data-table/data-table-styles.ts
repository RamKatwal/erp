export const dataTableClassNames = {
  table: "w-full caption-bottom border-collapse text-xs",
  headerRow: "border-b border-border bg-muted/50 text-muted-foreground",
  headerCell:
    "h-9 border-r border-border px-3 text-left align-middle text-xs font-medium whitespace-nowrap last:border-r-0",
  bodyRow:
    "border-b border-border bg-card transition-colors hover:bg-muted/25 data-[state=selected]:bg-muted/40",
  bodyCell:
    "h-9 border-r border-border px-3 align-middle whitespace-nowrap last:border-r-0",
  selectCell: "w-10 px-2 text-center [&_[data-slot=checkbox]]:mx-auto",
  emptyCell: "h-24 px-4 text-center text-muted-foreground",
} as const
