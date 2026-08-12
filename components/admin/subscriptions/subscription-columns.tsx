"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import {
  EyeIcon,
  MoreVerticalIcon,
  Settings2Icon,
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
import { formatCurrency } from "@/lib/format"
import {
  billingIntervalLabels,
  formatPaymentMethodSummary,
  subscriptionStatusLabels,
  type Subscription,
  type SubscriptionStatus,
} from "@/types/subscription"

function statusBadgeVariant(
  status: SubscriptionStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default"
    case "trialing":
      return "secondary"
    case "past_due":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "outline"
  }
}

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <Button
        variant="link"
        className="h-auto px-0 font-medium"
        nativeButton={false}
        render={
          <Link href={`/admin/subscriptions/${row.original.id}`} />
        }
      >
        {row.getValue("id")}
      </Button>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => (
      <Button
        variant="link"
        className="h-auto px-0 font-medium"
        nativeButton={false}
        render={
          <Link href={`/admin/subscriptions/${row.original.id}`} />
        }
      >
        {row.getValue("companyName")}
      </Button>
    ),
  },
  {
    id: "plan",
    accessorFn: (row) => row.planName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trial Plan" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{row.original.planName}</span>
        {row.original.isTrial ? (
          <Badge variant="secondary">Trial</Badge>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={statusBadgeVariant(row.original.status)}>
        {subscriptionStatusLabels[row.original.status]}
      </Badge>
    ),
  },
  {
    id: "branches",
    accessorFn: (row) => row.branchesUsed,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branches" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.branchesUsed} / {row.original.branchesLimit}
      </span>
    ),
  },
  {
    id: "users",
    accessorFn: (row) => row.usersUsed,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.usersUsed} / {row.original.usersLimit}
      </span>
    ),
  },
  {
    id: "paymentMethod",
    accessorFn: (row) => formatPaymentMethodSummary(row.paymentMethod),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatPaymentMethodSummary(row.original.paymentMethod)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created on" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("createdAt")}</span>
    ),
  },
  {
    accessorKey: "periodEnd",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period End Date" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("periodEnd")}</span>
    ),
  },
  {
    accessorKey: "remainingDays",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remaining Days" />
    ),
    cell: ({ row }) => {
      const days = row.original.remainingDays
      return (
        <span
          className={
            days <= 7
              ? "font-medium tabular-nums text-destructive"
              : "tabular-nums text-muted-foreground"
          }
        >
          {days}
        </span>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        {formatCurrency(row.original.amount, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "interval",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Interval" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {billingIntervalLabels[row.original.interval]}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Open subscription actions"
              />
            }
          >
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={
                <Link href={`/admin/subscriptions/${row.original.id}`} />
              }
            >
              <EyeIcon />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href={`/admin/subscriptions/${row.original.id}`} />
              }
            >
              <Settings2Icon />
              Manage
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]
