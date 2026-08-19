"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import {
  BranchAccessChips,
  CompanyAccessChips,
  groupedBranchAccessSearchText,
} from "@/components/settings/users-permissions/grouped-branch-chips"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Group } from "@/types/group"

type GroupColumnHandlers = {
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
}

export function createPermissionGroupColumns({
  onEdit,
  onDelete,
}: GroupColumnHandlers): ColumnDef<Group>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role Name" />
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
      id: "companies",
      accessorFn: (row) => groupedBranchAccessSearchText(row.branchIds ?? []),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => (
        <CompanyAccessChips branchIds={row.original.branchIds ?? []} />
      ),
      meta: { wrapCell: true },
    },
    {
      id: "branches",
      accessorFn: (row) => groupedBranchAccessSearchText(row.branchIds ?? []),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Branches" />
      ),
      cell: ({ row }) => (
        <BranchAccessChips branchIds={row.original.branchIds ?? []} />
      ),
      meta: { wrapCell: true },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return (
          <span className="line-clamp-2 text-muted-foreground">
            {description || "—"}
          </span>
        )
      },
      meta: { wrapCell: true },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${row.original.name}`}
                />
              }
            >
              <MoreVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <PencilIcon />
                Edit role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(row.original)}
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
