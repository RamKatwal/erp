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
import { groupedBranchAccessSearchText } from "@/components/settings/users-permissions/grouped-branch-chips"
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
import { normalizeGroupCompanies, type Group } from "@/types/group"

export function PermissionGroupsPage() {
  const [groups, setGroups] = React.useState<Group[]>(mockPermissionGroups)
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create")
  const [editingGroup, setEditingGroup] = React.useState<Group | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroups(readPermissionGroups().map(normalizeGroupCompanies))
  }, [])

  const persist = React.useCallback((next: Group[]) => {
    const normalized = next.map(normalizeGroupCompanies)
    setGroups(normalized)
    savePermissionGroups(normalized)
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

  function handleFormSubmit(
    values: PermissionGroupFormValues & { companyNames: string[] }
  ) {
    if (dialogMode === "create") {
      const nextGroup = normalizeGroupCompanies({
        id: createPermissionGroupId(values.name),
        name: values.name,
        description: values.description ?? "",
        companyIds: values.companyIds,
        companyNames: values.companyNames,
        branchIds: values.branchIds,
      })
      persist([nextGroup, ...groups])
      return
    }

    if (!editingGroup) return

    persist(
      groups.map((group) =>
        group.id === editingGroup.id
          ? normalizeGroupCompanies({
              ...group,
              name: values.name,
              description: values.description ?? "",
              companyIds: values.companyIds,
              companyNames: values.companyNames,
              branchIds: values.branchIds,
            })
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
      const item = normalizeGroupCompanies(row.original)

      const accessMatches = groupedBranchAccessSearchText(
        item.branchIds ?? []
      )
        .toLowerCase()
        .includes(query)

      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        accessMatches
      )
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="User Roles"
        count={`${groups.length} roles`}
        description="Create roles across companies and branches. Configure module access in Permission Management."
        actions={
          <Button size="sm" onClick={openCreate}>
            <PlusIcon />
            Add User Role
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
            searchPlaceholder="Search roles..."
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
          emptyMessage="No user roles yet. Add a role to start assigning permissions."
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
