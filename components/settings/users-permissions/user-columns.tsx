"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import {
  BranchAccessChips,
  CompanyAccessChips,
  groupedBranchAccessSearchText,
} from "@/components/settings/users-permissions/grouped-branch-chips"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Group } from "@/types/group"
import type { AppUser } from "@/types/user"

type UserColumnHandlers = {
  groups: Group[]
  onView: (user: AppUser) => void
  onEdit: (user: AppUser) => void
  onActivate: (user: AppUser) => void
  onDeactivate: (user: AppUser) => void
}

export function getUserRoleLabel(user: AppUser, roles: Group[]) {
  const roleId = user.assignments[0]?.groupId
  if (!roleId) return "—"
  return roles.find((role) => role.id === roleId)?.name ?? roleId
}

export function getUserAccessLabel(user: AppUser) {
  if (user.assignments.length === 0) return "No access"
  return groupedBranchAccessSearchText(
    user.assignments.map((assignment) => assignment.branchId)
  )
}

export function createUserColumns({
  groups,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
}: UserColumnHandlers): ColumnDef<AppUser>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("email")}</span>
      ),
    },
    {
      id: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      accessorFn: (row) => getUserRoleLabel(row, groups),
      cell: ({ row }) => (
        <span className="text-sm">{getUserRoleLabel(row.original, groups)}</span>
      ),
    },
    {
      id: "companies",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      accessorFn: (row) =>
        groupedBranchAccessSearchText(
          row.assignments.map((assignment) => assignment.branchId)
        ),
      cell: ({ row }) => (
        <CompanyAccessChips
          branchIds={row.original.assignments.map(
            (assignment) => assignment.branchId
          )}
          emptyLabel="No access"
        />
      ),
      meta: { wrapCell: true },
    },
    {
      id: "branches",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Branches" />
      ),
      accessorFn: (row) =>
        groupedBranchAccessSearchText(
          row.assignments.map((assignment) => assignment.branchId)
        ),
      cell: ({ row }) => (
        <BranchAccessChips
          branchIds={row.original.assignments.map(
            (assignment) => assignment.branchId
          )}
          emptyLabel="No access"
        />
      ),
      meta: { wrapCell: true },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${user.name}`}
                  />
                }
              >
                <MoreVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(user)}>
                  <EyeIcon />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <PencilIcon />
                  Edit user
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.status === "active" ? (
                  <DropdownMenuItem onClick={() => onDeactivate(user)}>
                    <UserRoundXIcon />
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onActivate(user)}>
                    <UserRoundCheckIcon />
                    Activate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
