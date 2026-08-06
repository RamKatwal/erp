"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  type DataTableRowSize,
  dataTableFullscreenClassName,
  DataTableToolbar,
  DataTableView,
  useDataTable,
  useDataTableFullscreen,
} from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { createPermissionGroupColumns } from "@/components/settings/users-permissions/group-columns"
import {
  PermissionGroupFormDialog,
  type PermissionGroupFormValues,
} from "@/components/settings/users-permissions/group-form-dialog"
import { Button } from "@/components/ui/button"
import { mockPermissionGroups } from "@/lib/mock/permission-groups"
import {
  createPermissionGroupId,
  readPermissionGroups,
  savePermissionGroups,
} from "@/lib/users/groups-storage"
import {
  readGroupBranchPermissions,
  saveGroupBranchPermissions,
} from "@/lib/users/permission-storage"
import { cn } from "@/lib/utils"
import type { Group } from "@/types/group"

export function PermissionGroupsPage() {
  const [groups, setGroups] = React.useState<Group[]>(mockPermissionGroups)
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create")
  const [editingGroup, setEditingGroup] = React.useState<Group | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroups(readPermissionGroups())
  }, [])

  const persist = React.useCallback((next: Group[]) => {
    setGroups(next)
    savePermissionGroups(next)
  }, [])

  function openCreate() {
    setDialogMode("create")
    setEditingGroup(null)
    setDialogOpen(true)
  }

  function openEdit(group: Group) {
    setDialogMode("edit")
    setEditingGroup(group)
    setDialogOpen(true)
  }

  function handleFormSubmit(values: PermissionGroupFormValues) {
    if (dialogMode === "create") {
      const nextGroup: Group = {
        id: createPermissionGroupId(values.name),
        name: values.name,
        description: values.description ?? "",
      }
      persist([nextGroup, ...groups])
      return
    }

    if (!editingGroup) return

    persist(
      groups.map((group) =>
        group.id === editingGroup.id
          ? {
              ...group,
              name: values.name,
              description: values.description ?? "",
            }
          : group
      )
    )
  }

  function handleDelete(group: Group) {
    persist(groups.filter((item) => item.id !== group.id))
    saveGroupBranchPermissions(
      readGroupBranchPermissions().filter(
        (entry) => entry.groupId !== group.id
      )
    )
  }

  const columns = React.useMemo(
    () =>
      createPermissionGroupColumns({
        onEdit: openEdit,
        onDelete: handleDelete,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups]
  )

  const table = useDataTable({
    data: groups,
    columns,
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
      <PageHeader
        title="Groups"
        count={`${groups.length} groups`}
        description="Create groups with no permissions by default. Configure access per branch in Permission Management."
        actions={
          <Button size="sm" onClick={openCreate}>
            <PlusIcon />
            Add Group
          </Button>
        }
      />

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-xs",
          dataTableFullscreenClassName(isFullscreen)
        )}
      >
        <div className="flex flex-col gap-3 border-b px-3 py-2.5 sm:flex-row sm:items-center sm:justify-end">
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
          columnCount={columns.length}
          rowSize={rowSize}
          emptyMessage="No groups yet. Add a group to start assigning permissions."
        />
      </div>

      <PermissionGroupFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        group={editingGroup}
        existingNames={groups.map((group) => group.name)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
