"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  MoreVerticalIcon,
  PencilIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  findCompanyForBranch,
  getBranchLabel,
} from "@/lib/companies/options"
import type { Group } from "@/types/group"
import type { AppUser } from "@/types/user"

type UserColumnHandlers = {
  groups: Group[]
  onEdit: (user: AppUser) => void
  onActivate: (user: AppUser) => void
  onDeactivate: (user: AppUser) => void
}

function roleLabel(user: AppUser, roles: Group[]) {
  const roleId = user.assignments[0]?.groupId
  if (!roleId) return "—"
  return roles.find((role) => role.id === roleId)?.name ?? roleId
}

function accessLabel(user: AppUser) {
  if (user.assignments.length === 0) return "No access"

  return user.assignments
    .map((assignment) => {
      const company = findCompanyForBranch(assignment.branchId)
      const branch =
        getBranchLabel(assignment.branchId) ?? assignment.branchId
      return company ? `${company.name} · ${branch}` : branch
    })
    .join(", ")
}

export function createUserColumns({
  groups,
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
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={() => onEdit(row.original)}
        >
          {row.getValue("name")}
        </button>
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
      accessorFn: (row) => roleLabel(row, groups),
      cell: ({ row }) => (
        <span className="text-sm">{roleLabel(row.original, groups)}</span>
      ),
    },
    {
      id: "access",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Companies & branches" />
      ),
      accessorFn: (row) => accessLabel(row),
      cell: ({ row }) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {accessLabel(row.original)}
        </span>
      ),
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
