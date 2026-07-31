"use client"

import * as React from "react"
import { DownloadIcon, PlusIcon } from "lucide-react"

import {
  type DataTableRowSize,
  dataTableFullscreenClassName,
  DataTableToolbar,
  DataTableView,
  useDataTable,
  useDataTableFullscreen,
} from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { purchaseReturnColumns } from "@/components/purchase/return/purchase-return-columns"
import { Button } from "@/components/ui/button"
import { FilterTabs } from "@/components/ui/filter-tabs"
import { mockPurchaseReturns } from "@/lib/mock/purchase-returns"
import { cn } from "@/lib/utils"
import {
  purchaseReturnStatusLabels,
  type PurchaseReturnStatus,
} from "@/types/purchase-return"

const statusTabs: PurchaseReturnStatus[] = [
  "approved",
  "draft",
  "for-approval",
  "void",
]

export function PurchaseReturnPage() {
  const [activeStatus, setActiveStatus] =
    React.useState<PurchaseReturnStatus>("approved")
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()

  const filteredData = React.useMemo(
    () => mockPurchaseReturns.filter((item) => item.status === activeStatus),
    [activeStatus]
  )

  const statusTabItems = React.useMemo(
    () =>
      statusTabs.map((status) => ({
        value: status,
        label: purchaseReturnStatusLabels[status],
        count: mockPurchaseReturns.filter((item) => item.status === status)
          .length,
      })),
    []
  )

  const table = useDataTable({
    data: filteredData,
    columns: purchaseReturnColumns,
    pageSize: 10,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = filterValue.toLowerCase()
      const item = row.original

      return (
        item.id.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query) ||
        item.refInvoice.toLowerCase().includes(query) ||
        item.entryDate.includes(query)
      )
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Purchase Return"
        count={`${mockPurchaseReturns.length} returns`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <DownloadIcon />
              Export
            </Button>
            <Button size="sm">
              <PlusIcon />
              Create Purchase Return
            </Button>
          </>
        }
      />

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-xs",
          dataTableFullscreenClassName(isFullscreen)
        )}
      >
        <div className="flex flex-col gap-3 border-b px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
          <FilterTabs
            items={statusTabItems}
            value={activeStatus}
            onValueChange={(status) => {
              setActiveStatus(status)
              table.setPageIndex(0)
            }}
          />

          <DataTableToolbar
            table={table}
            searchPlaceholder="Search returns..."
            rowSize={rowSize}
            onRowSizeChange={setRowSize}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>

        <DataTableView
          table={table}
          columnCount={purchaseReturnColumns.length}
          rowSize={rowSize}
          emptyMessage={`No ${purchaseReturnStatusLabels[activeStatus].toLowerCase()} returns found.`}
        />
      </div>
    </div>
  )
}
