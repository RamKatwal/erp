"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
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
  getBranchesByIds,
  type ResolvedBranchOption,
} from "@/lib/companies/options"
import { cn } from "@/lib/utils"
import { type Group } from "@/types/group"

type GroupColumnHandlers = {
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
}

const companyChipClass = [
  "bg-sky-500/12 text-sky-800 dark:text-sky-300",
  "bg-violet-500/12 text-violet-800 dark:text-violet-300",
  "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
  "bg-amber-500/12 text-amber-800 dark:text-amber-300",
  "bg-rose-500/12 text-rose-800 dark:text-rose-300",
  "bg-teal-500/12 text-teal-800 dark:text-teal-300",
] as const

function companyChipTone(companyId: string) {
  let hash = 0
  for (const char of companyId) {
    hash = (hash + char.charCodeAt(0)) % companyChipClass.length
  }
  return companyChipClass[hash]
}

function branchChipLabel(branch: ResolvedBranchOption) {
  return branch.isHeadOffice ? "Head Office" : branch.name
}

function accessSearchText(group: Group) {
  return getBranchesByIds(group.branchIds ?? [])
    .map(
      (branch) =>
        `${branch.companyName} ${branchChipLabel(branch)} ${branch.code}`
    )
    .join(" ")
}

function RoleAccessChips({ group }: { group: Group }) {
  const branches = getBranchesByIds(group.branchIds ?? [])

  if (branches.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-1 whitespace-normal">
      {branches.map((branch) => (
        <Badge
          key={branch.id}
          variant="outline"
          className={cn(
            "h-4 rounded-md border-transparent px-1.5 text-[10px] font-normal",
            branch.isHeadOffice
              ? "bg-primary/12 text-primary"
              : companyChipTone(branch.companyId)
          )}
        >
          {branchChipLabel(branch)}
        </Badge>
      ))}
    </div>
  )
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
      id: "access",
      accessorFn: (row) => accessSearchText(row),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Branch access" />
      ),
      cell: ({ row }) => <RoleAccessChips group={row.original} />,
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
