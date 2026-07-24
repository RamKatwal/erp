"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
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
import type { Group } from "@/types/group"

export const groupColumns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group Name" />
    ),
    cell: ({ row }) => (
      <Button variant="link" className="h-auto px-0 font-medium">
        {row.getValue("name")}
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("description")}</span>
    ),
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
            <DropdownMenuItem>
              <UsersIcon />
              View members
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PencilIcon />
              Edit group
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
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
