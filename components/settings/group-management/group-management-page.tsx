"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import {
  type DataTableRowSize,
  dataTableFullscreenClassName,
  DataTableToolbar,
  DataTableView,
  useDataTable,
  useDataTableFullscreen,
} from "@/components/data-table/data-table"
import { groupColumns } from "@/components/settings/group-management/group-columns"
import { Button } from "@/components/ui/button"
import {
  readCustomGroups,
  readGroupConfiguration,
} from "@/lib/groups/storage"
import { mockGroups } from "@/lib/mock/groups"
import { cn } from "@/lib/utils"

export function GroupManagementPage() {
  const [groups, setGroups] = React.useState(mockGroups)
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()

  React.useEffect(() => {
    const savedGroups = [...mockGroups, ...readCustomGroups()].map((group) => {
      const configuration = readGroupConfiguration(group)
      return {
        id: configuration.id,
        name: configuration.name,
        description: configuration.description,
      }
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroups(savedGroups)
  }, [])

  const table = useDataTable({
    data: groups,
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

        <Button
          variant="glass"
          nativeButton={false}
          render={<Link href="/settings/users/group-management/new" />}
        >
          <PlusIcon />
          New Group
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-xs",
          dataTableFullscreenClassName(isFullscreen)
        )}
      >
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-end">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Search groups..."
            rowSize={rowSize}
            onRowSizeChange={setRowSize}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>

        <DataTableView
          table={table}
          columnCount={groupColumns.length}
          rowSize={rowSize}
          emptyMessage="No groups found."
        />
      </div>
    </div>
  )
}
