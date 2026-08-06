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
import type { Branch } from "@/types/branch"
import type { Group } from "@/types/group"
import type { AppUser } from "@/types/user"

type UserColumnHandlers = {
  branches: Branch[]
  groups: Group[]
  onEdit: (user: AppUser) => void
  onActivate: (user: AppUser) => void
  onDeactivate: (user: AppUser) => void
}

function assignmentLabel(
  user: AppUser,
  branches: Branch[],
  groups: Group[]
) {
  if (user.assignments.length === 0) return "No entities"

  return user.assignments
    .map((assignment) => {
      const branch =
        branches.find((item) => item.id === assignment.branchId)?.name ??
        assignment.branchId
      const group =
        groups.find((item) => item.id === assignment.groupId)?.name ??
        assignment.groupId
      return `${branch} · ${group}`
    })
    .join(", ")
}

export function createUserColumns({
  branches,
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
      id: "assignments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entity assignments" />
      ),
      accessorFn: (row) => assignmentLabel(row, branches, groups),
      cell: ({ row }) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {assignmentLabel(row.original, branches, groups)}
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
