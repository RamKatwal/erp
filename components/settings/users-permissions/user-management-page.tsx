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
import { readCustomGroups } from "@/lib/groups/storage"
import { mockGroups } from "@/lib/mock/groups"
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
import { normalizeGroupCompanies, type Group } from "@/types/group"
import type { AppUser } from "@/types/user"

export type UserRoleSource = "permission-groups" | "configuration-roles"

type UserManagementPageProps = {
  /** Where role options come from. Defaults to admin permission groups. */
  roleSource?: UserRoleSource
}

function readConfigurationRoles(): Group[] {
  const byId = new Map<string, Group>()
  for (const role of [...mockGroups, ...readCustomGroups()]) {
    byId.set(role.id, normalizeGroupCompanies(role))
  }
  return Array.from(byId.values())
}

function loadRoles(roleSource: UserRoleSource): Group[] {
  if (roleSource === "configuration-roles") {
    return readConfigurationRoles()
  }
  return readPermissionGroups().map((role) => normalizeGroupCompanies(role))
}

export function UserManagementPage({
  roleSource = "permission-groups",
}: UserManagementPageProps) {
  const [users, setUsers] = React.useState<AppUser[]>(mockUsers)
  const [roles, setRoles] = React.useState<Group[]>(
    roleSource === "configuration-roles"
      ? mockGroups.map((role) => normalizeGroupCompanies(role))
      : mockPermissionGroups.map((role) => normalizeGroupCompanies(role))
  )
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create")
  const [editingUser, setEditingUser] = React.useState<AppUser | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(readUsers())
    setRoles(loadRoles(roleSource))
  }, [roleSource])

  const persist = React.useCallback((next: AppUser[]) => {
    setUsers(next)
    saveUsers(next)
  }, [])

  function openCreate() {
    setRoles(loadRoles(roleSource))
    setDialogMode("create")
    setEditingUser(null)
    setDialogOpen(true)
  }

  function openEdit(user: AppUser) {
    setRoles(loadRoles(roleSource))
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
        username: values.username.trim(),
        contact: values.contact.trim(),
        address: values.address.trim(),
        designation: values.designation.trim(),
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
              username: values.username.trim(),
              contact: values.contact.trim(),
              address: values.address.trim(),
              designation: values.designation.trim(),
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
        groups: roles,
        onEdit: openEdit,
        onActivate: (user) => setStatus(user, "active"),
        onDeactivate: (user) => setStatus(user, "inactive"),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, roles]
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
        item.username?.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      )
    },
  })

  const canAddUser = roles.length > 0

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="User Management"
        count={`${users.length} users`}
        description="Pick a role, then grant access to that role’s companies and branches."
        actions={
          <div className="flex items-center gap-2">
            {!canAddUser ? (
              <span className="text-xs text-muted-foreground">
                Create a user role first
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
          onRowClick={openEdit}
        />
      </div>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        user={editingUser}
        roles={roles}
        existingEmails={users.map((user) => user.email)}
        existingUsernames={users.map((user) => user.username ?? "")}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
