"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getBranchLabel } from "@/lib/companies/options"
import { normalizeGroupCompanies, type Group } from "@/types/group"

type GroupColumnHandlers = {
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
}

function formatCompanies(group: Group) {
  const normalized = normalizeGroupCompanies(group)
  const names = normalized.companyNames ?? []
  if (names.length === 0) return "—"
  if (names.length <= 2) return names.join(", ")
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`
}

function formatBranches(group: Group) {
  const branchIds = group.branchIds ?? []
  if (branchIds.length === 0) return "—"

  const names = branchIds
    .map((id) => getBranchLabel(id) ?? id)
    .filter(Boolean)

  if (names.length <= 2) {
    return names.join(", ")
  }

  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`
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
      accessorFn: (row) => formatCompanies(row),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Companies" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatCompanies(row.original)}
        </span>
      ),
    },
    {
      id: "branches",
      accessorFn: (row) => formatBranches(row),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Branches" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatBranches(row.original)}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return (
          <span className="text-muted-foreground">
            {description || "—"}
          </span>
        )
      },
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
