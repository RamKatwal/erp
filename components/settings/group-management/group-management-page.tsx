"use client"

import { PlusIcon } from "lucide-react"

import {
  DataTableToolbar,
  DataTableView,
  useDataTable,
} from "@/components/data-table/data-table"
import { groupColumns } from "@/components/settings/group-management/group-columns"
import { Button } from "@/components/ui/button"
import { mockGroups } from "@/lib/mock/groups"

export function GroupManagementPage() {
  const table = useDataTable({
    data: mockGroups,
    columns: groupColumns,
    pageSize: 10,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = filterValue.toLowerCase()
      const item = row.original

      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Group Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create groups and assign shared access across modules.
          </p>
        </div>

        <Button variant="glass">
          <PlusIcon />
          New Group
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-end">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Search groups..."
          />
        </div>

        <DataTableView
          table={table}
          columnCount={groupColumns.length}
          emptyMessage="No groups found."
        />
      </div>
    </div>
  )
}
