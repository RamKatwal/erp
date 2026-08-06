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
import { createUserColumns } from "@/components/settings/users-permissions/user-columns"
import {
  UserFormDialog,
  type UserFormValues,
} from "@/components/settings/users-permissions/user-form-dialog"
import { Button } from "@/components/ui/button"
import { readBranches } from "@/lib/branches/storage"
import { mockBranches } from "@/lib/mock/branches"
import { mockPermissionGroups } from "@/lib/mock/permission-groups"
import { mockUsers } from "@/lib/mock/users"
import { readPermissionGroups } from "@/lib/users/groups-storage"
import {
  createUserId,
  readUsers,
  saveUsers,
  todayIsoDate,
} from "@/lib/users/storage"
import { cn } from "@/lib/utils"
import type { Branch } from "@/types/branch"
import type { Group } from "@/types/group"
import type { AppUser } from "@/types/user"

export function UserManagementPage() {
  const [users, setUsers] = React.useState<AppUser[]>(mockUsers)
  const [branches, setBranches] = React.useState<Branch[]>(mockBranches)
  const [groups, setGroups] = React.useState<Group[]>(mockPermissionGroups)
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create")
  const [editingUser, setEditingUser] = React.useState<AppUser | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(readUsers())
    setBranches(readBranches().filter((branch) => branch.status === "active"))
    setGroups(readPermissionGroups())
  }, [])

  const persist = React.useCallback((next: AppUser[]) => {
    setUsers(next)
    saveUsers(next)
  }, [])

  function openCreate() {
    setDialogMode("create")
    setEditingUser(null)
    setDialogOpen(true)
  }

  function openEdit(user: AppUser) {
    setDialogMode("edit")
    setEditingUser(user)
    setDialogOpen(true)
  }

  function handleFormSubmit(values: UserFormValues) {
    if (dialogMode === "create") {
      const nextUser: AppUser = {
        id: createUserId(values.email),
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        status: "active",
        assignments: values.assignments.map((assignment) => ({
          ...assignment,
        })),
        createdAt: todayIsoDate(),
      }
      persist([nextUser, ...users])
      return
    }

    if (!editingUser) return

    persist(
      users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: values.name.trim(),
              email: values.email.trim().toLowerCase(),
              assignments: values.assignments.map((assignment) => ({
                ...assignment,
              })),
            }
          : user
      )
    )
  }

  function setStatus(user: AppUser, status: AppUser["status"]) {
    persist(
      users.map((item) =>
        item.id === user.id ? { ...item, status } : item
      )
    )
  }

  const columns = React.useMemo(
    () =>
      createUserColumns({
        branches,
        groups,
        onEdit: openEdit,
        onActivate: (user) => setStatus(user, "active"),
        onDeactivate: (user) => setStatus(user, "inactive"),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, branches, groups]
  )

  const table = useDataTable({
    data: users,
    columns,
    pageSize: 10,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = filterValue.toLowerCase()
      const item = row.original

      return (
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      )
    },
  })

  const canAddUser = branches.length > 0 && groups.length > 0

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="User Management"
        count={`${users.length} users`}
        description="Assign users to one or more entities. Each entity uses an independently selected group for permissions."
        actions={
          <div className="flex items-center gap-2">
            {!canAddUser ? (
              <span className="text-xs text-muted-foreground">
                Need an active branch and a group
              </span>
            ) : null}
            <Button size="sm" disabled={!canAddUser} onClick={openCreate}>
              <PlusIcon />
              Add User
            </Button>
          </div>
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
            searchPlaceholder="Search users..."
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
          emptyMessage="No users found."
        />
      </div>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        user={editingUser}
        branches={branches}
        groups={groups}
        existingEmails={users.map((user) => user.email)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
