"use client"

import * as React from "react"
import { DownloadIcon, PlusIcon } from "lucide-react"

import {
  DataTableToolbar,
  DataTableView,
  useDataTable,
} from "@/components/data-table/data-table"
import { purchaseReturnColumns } from "@/components/purchase/return/purchase-return-columns"
import { Button } from "@/components/ui/button"
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

  const filteredData = React.useMemo(
    () => mockPurchaseReturns.filter((item) => item.status === activeStatus),
    [activeStatus]
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Purchase Return
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <DownloadIcon />
            Export
          </Button>
          <Button variant="glass">
            <PlusIcon />
            Create Purchase Return
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {statusTabs.map((status) => {
              const count = mockPurchaseReturns.filter(
                (item) => item.status === status
              ).length

              return (
                <Button
                  key={status}
                  type="button"
                  variant={activeStatus === status ? "default" : "outline"}
                  onClick={() => {
                    setActiveStatus(status)
                    table.setPageIndex(0)
                  }}
                >
                  {purchaseReturnStatusLabels[status]}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                      activeStatus === status
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </Button>
              )
            })}
          </div>

          <DataTableToolbar
            table={table}
            searchPlaceholder="Search returns..."
          />
        </div>

        <DataTableView
          table={table}
          columnCount={purchaseReturnColumns.length}
          emptyMessage={`No ${purchaseReturnStatusLabels[activeStatus].toLowerCase()} returns found.`}
        />
      </div>
    </div>
  )
}
