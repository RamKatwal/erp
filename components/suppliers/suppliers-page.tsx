"use client"

import * as React from "react"
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react"

import {
  type DataTableRowSize,
  DataTableCard,
  useDataTable,
  useDataTableFullscreen,
} from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { PartyNav } from "@/components/parties/party-nav"
import { createSupplierColumns } from "@/components/suppliers/supplier-columns"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import { mockSuppliers, supplierCategories } from "@/lib/mock/suppliers"
import type { Supplier, SupplierStatus } from "@/types/supplier"

export function SuppliersPage() {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(mockSuppliers)
  const [statusTab, setStatusTab] = React.useState<SupplierStatus>("active")
  const [categoryFilter, setCategoryFilter] = React.useState("All")
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()

  const activeCount = suppliers.filter((item) => item.status === "active").length
  const inactiveCount = suppliers.filter(
    (item) => item.status === "inactive"
  ).length

  const filteredData = React.useMemo(
    () =>
      suppliers.filter((item) => {
        if (item.status !== statusTab) return false
        if (categoryFilter === "All") return true
        return item.category === categoryFilter
      }),
    [suppliers, statusTab, categoryFilter]
  )

  function setStatus(supplier: Supplier, status: SupplierStatus) {
    setSuppliers((current) =>
      current.map((item) =>
        item.id === supplier.id ? { ...item, status } : item
      )
    )
  }

  const columns = React.useMemo(
    () =>
      createSupplierColumns({
        onEdit: () => {},
        onDeactivate: (supplier) => setStatus(supplier, "inactive"),
        onActivate: (supplier) => setStatus(supplier, "active"),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suppliers]
  )

  const categoryFilterOptions = React.useMemo(
    () =>
      supplierCategories.map((category) => ({
        value: category,
        label: category === "All" ? "Category: All" : category,
        count:
          category === "All"
            ? suppliers.filter((item) => item.status === statusTab).length
            : suppliers.filter(
                (item) =>
                  item.status === statusTab && item.category === category
              ).length,
      })),
    [suppliers, statusTab]
  )

  const table = useDataTable({
    data: filteredData,
    columns,
    pageSize: 10,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = filterValue.toLowerCase()
      const item = row.original

      return (
        item.id.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.contact.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.entryBy.toLowerCase().includes(query)
      )
    },
  })

  const statusTabItems = [
    { value: "active", label: "Active", count: activeCount },
    { value: "inactive", label: "Inactive", count: inactiveCount },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PartyNav />

      <PageHeader
        title="Suppliers"
        count={`${suppliers.length} suppliers`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <DownloadIcon />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <UploadIcon />
              Import
            </Button>
            <Button size="sm">
              <PlusIcon />
              Create Supplier
            </Button>
          </>
        }
      />

      <DataTableCard
        table={table}
        columnCount={columns.length}
        searchPlaceholder="Search suppliers..."
        rowSize={rowSize}
        onRowSizeChange={setRowSize}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        emptyMessage={`No ${statusTab} suppliers found.`}
        leading={
          <Tabs
            items={statusTabItems}
            value={statusTab}
            onValueChange={(status) => {
              if (typeof status !== "string") return
              setStatusTab(status as SupplierStatus)
              table.setPageIndex(0)
            }}
          />
        }
        filters={{
          value: categoryFilter,
          options: categoryFilterOptions,
          onValueChange: (value) => {
            setCategoryFilter(value)
            table.setPageIndex(0)
          },
        }}
      />
    </div>
  )
}
