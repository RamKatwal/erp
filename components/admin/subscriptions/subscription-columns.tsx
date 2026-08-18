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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  branchAvatarItems,
  StackedAvatars,
  userAvatarItems,
} from "@/components/admin/subscriptions/stacked-avatars"
import { formatCurrency } from "@/lib/format"
import {
  billingIntervalLabels,
  formatPaymentMethodSummary,
  subscriptionStatusLabels,
  type Subscription,
  type SubscriptionStatus,
} from "@/types/subscription"

function companyInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}

function statusBadgeClassName(status: SubscriptionStatus) {
  switch (status) {
    case "active":
      return "border-transparent bg-success/15 text-success"
    case "trialing":
      return "border-transparent bg-secondary text-secondary-foreground"
    case "past_due":
      return "border-transparent bg-destructive/10 text-destructive"
    case "pending":
      return "border-border text-foreground"
    default:
      return "border-border text-muted-foreground"
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
    cell: ({ row }) => {
      const { companyName, companyLogoUrl, id } = row.original
      return (
        <div className="flex min-w-0 items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Avatar
                  size="sm"
                  className="after:border-border/60"
                  aria-label={companyName}
                />
              }
            >
              {companyLogoUrl ? (
                <AvatarImage src={companyLogoUrl} alt="" />
              ) : null}
              <AvatarFallback className="bg-muted text-[10px] font-semibold text-foreground">
                {companyInitials(companyName)}
              </AvatarFallback>
            </TooltipTrigger>
            <TooltipContent side="top">{companyName}</TooltipContent>
          </Tooltip>
          <Button
            variant="link"
            className="h-auto min-w-0 truncate px-0 font-medium"
            nativeButton={false}
            render={<Link href={`/admin/subscriptions/${id}`} />}
          >
            {companyName}
          </Button>
        </div>
      )
    },
  },
  {
    id: "plan",
    accessorFn: (row) => row.planName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trial" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.planName}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={statusBadgeClassName(row.original.status)}
      >
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
      <StackedAvatars
        items={branchAvatarItems(row.original.assignedBranches)}
        total={row.original.branchesUsed}
      />
    ),
  },
  {
    id: "users",
    accessorFn: (row) => row.usersUsed,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => (
      <StackedAvatars
        items={userAvatarItems(row.original.members, row.original.usersUsed)}
        total={row.original.usersUsed}
      />
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
