"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { EyeOffIcon, PencilIcon } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Customer } from "@/types/customer"

type CustomerColumnActions = {
  onEdit: (customer: Customer) => void
  onDeactivate: (customer: Customer) => void
  onActivate: (customer: Customer) => void
}

function displayValue(value: string) {
  return value.trim() ? value : "—"
}

export function createCustomerColumns({
  onEdit,
  onDeactivate,
  onActivate,
}: CustomerColumnActions): ColumnDef<Customer>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? true : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("type")}</span>
      ),
    },
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
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => displayValue(row.getValue("address")),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[160px] truncate text-muted-foreground">
          {displayValue(row.getValue("email"))}
        </span>
      ),
    },
    {
      accessorKey: "contact",
      header: () => <span>Contact</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {displayValue(row.getValue("contact"))}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
    },
    {
      accessorKey: "entryBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entry By" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("entryBy")}</span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const customer = row.original
        const isActive = customer.status === "active"

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${customer.name}`}
              onClick={() => onEdit(customer)}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={
                isActive
                  ? `Deactivate ${customer.name}`
                  : `Activate ${customer.name}`
              }
              onClick={() =>
                isActive ? onDeactivate(customer) : onActivate(customer)
              }
            >
              <EyeOffIcon />
            </Button>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
