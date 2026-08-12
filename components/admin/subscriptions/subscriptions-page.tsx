"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  AddSubscriptionDialog,
  type AddSubscriptionFormValues,
} from "@/components/admin/subscriptions/add-subscription-dialog"
import { subscriptionColumns } from "@/components/admin/subscriptions/subscription-columns"
import {
  type DataTableRowSize,
  dataTableFullscreenClassName,
  DataTableToolbar,
  DataTableView,
  useDataTable,
  useDataTableFullscreen,
} from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { FilterTabs } from "@/components/ui/filter-tabs"
import { mockSubscriptions } from "@/lib/mock/subscriptions"
import { cn } from "@/lib/utils"
import {
  subscriptionStatusLabels,
  type Subscription,
  type SubscriptionStatus,
} from "@/types/subscription"

type StatusFilter = "all" | SubscriptionStatus

const statusFilterTabs: StatusFilter[] = [
  "all",
  "active",
  "trialing",
  "pending",
  "past_due",
]

const statusFilterLabels: Record<StatusFilter, string> = {
  all: "All",
  ...subscriptionStatusLabels,
}

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] =
    React.useState<Subscription[]>(mockSubscriptions)
  const [activeStatus, setActiveStatus] = React.useState<StatusFilter>("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()

  const filteredData = React.useMemo(
    () =>
      activeStatus === "all"
        ? subscriptions
        : subscriptions.filter((item) => item.status === activeStatus),
    [activeStatus, subscriptions]
  )

  const statusTabItems = React.useMemo(
    () =>
      statusFilterTabs.map((status) => ({
        value: status,
        label: statusFilterLabels[status],
        count:
          status === "all"
            ? subscriptions.length
            : subscriptions.filter((item) => item.status === status).length,
      })),
    [subscriptions]
  )

  const table = useDataTable({
    data: filteredData,
    columns: subscriptionColumns,
    pageSize: 10,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).toLowerCase()
      const item = row.original

      return (
        item.id.toLowerCase().includes(query) ||
        item.companyName.toLowerCase().includes(query) ||
        item.planName.toLowerCase().includes(query) ||
        (item.paymentMethod?.last4 ?? "").includes(query) ||
        (item.paymentMethod?.brand ?? "").toLowerCase().includes(query)
      )
    },
  })

  function handleAddSubscription(values: AddSubscriptionFormValues) {
    const planName =
      values.planId === "plan_ent_01"
        ? "Enterprise Plan"
        : values.planId === "plan_del_01"
          ? "De-lite Plan"
          : "Standard Plan"

    const next: Subscription = {
      id: `SUB-${Math.floor(10000 + Math.random() * 90000)}`,
      companyId: `comp_${Date.now()}`,
      companyName: values.companyName,
      planId: values.planId,
      planName,
      planTier: planName.replace(" Plan", ""),
      planDescription: "Newly provisioned subscription (mock)",
      isTrial: false,
      status: "pending",
      branchesUsed: 0,
      branchesLimit: values.planId === "plan_ent_01" ? 15 : 5,
      usersUsed: 0,
      usersLimit: values.planId === "plan_ent_01" ? 50 : 20,
      amount: values.planId === "plan_ent_01" ? 1200 : values.planId === "plan_del_01" ? 99 : 199,
      currency: "USD",
      interval: values.interval,
      createdAt: new Date().toISOString().slice(0, 10),
      periodEnd: new Date().toISOString().slice(0, 10),
      nextBillingDate: new Date().toISOString().slice(0, 10),
      remainingDays: 30,
      autoRenew: true,
      paymentMethod: null,
      features: ["Multi-Branch Management", "Email Support"],
      assignedBranches: [],
      invoices: [],
    }

    setSubscriptions((current) => [next, ...current])
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Subscriptions"
        count={`${subscriptions.length} subscriptions`}
        description="Overview of software licensing and branch entitlement usage across registered companies."
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <PlusIcon />
            Add / Upgrade Subscription
          </Button>
        }
      />

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-xs",
          dataTableFullscreenClassName(isFullscreen)
        )}
      >
        <div className="flex flex-col gap-3 border-b px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
          <FilterTabs
            items={statusTabItems}
            value={activeStatus}
            onValueChange={(status) => {
              setActiveStatus(status)
              table.setPageIndex(0)
            }}
          />

          <DataTableToolbar
            table={table}
            searchPlaceholder="Search subscriptions..."
            rowSize={rowSize}
            onRowSizeChange={setRowSize}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>

        <DataTableView
          table={table}
          columnCount={subscriptionColumns.length}
          rowSize={rowSize}
          emptyMessage={
            activeStatus === "all"
              ? "No subscriptions found."
              : `No ${statusFilterLabels[activeStatus].toLowerCase()} subscriptions found.`
          }
        />
      </div>

      <AddSubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddSubscription}
      />
    </div>
  )
}
