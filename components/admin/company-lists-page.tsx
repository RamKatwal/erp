"use client"

import * as React from "react"
import Link from "next/link"
import { LayoutGrid, List, Plus } from "lucide-react"

import {
  organizationPlanBadgeClassName,
  organizationStatusBadgeClassName,
  organizationColumns,
} from "@/components/admin/organization-columns"
import {
  branchAvatarItems,
  StackedAvatars,
  userAvatarItems,
} from "@/components/admin/subscriptions/stacked-avatars"
import { CompanyLogo } from "@/components/company-logo"
import {
  type DataTableRowSize,
  DataTableCard,
  useDataTable,
  useDataTableFullscreen,
} from "@/components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  homeOrganizations,
  organizationNeedsUpgrade,
  type HomeOrganization,
} from "@/lib/admin/home-organizations"
import { cn } from "@/lib/utils"
import { subscriptionStatusLabels } from "@/types/subscription"

type ViewMode = "grid" | "list"

function OrganizationPlanBadge({ plan }: { plan: string }) {
  return (
    <Badge
      className={cn(
        "h-5 px-1.5 text-[10px] font-medium",
        organizationPlanBadgeClassName(plan)
      )}
    >
      {plan}
    </Badge>
  )
}

function OrganizationActions({
  org,
  fullWidth = false,
}: {
  org: HomeOrganization
  fullWidth?: boolean
}) {
  const showUpgrade = organizationNeedsUpgrade(org)

  return (
    <div
      className={cn(
        "flex gap-2",
        fullWidth ? "w-full flex-col" : "flex-wrap items-center justify-end"
      )}
    >
      {showUpgrade ? (
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          className={cn(
            "border-primary text-primary hover:bg-primary/10 hover:text-primary",
            fullWidth && "w-full"
          )}
          render={<Link href={`/admin/subscriptions/${org.id}`} />}
        >
          Upgrade
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          className={cn(
            "border-primary text-primary hover:bg-primary/10 hover:text-primary",
            fullWidth && "w-full"
          )}
          render={<Link href="/" />}
        >
          Go to company
        </Button>
      )}
    </div>
  )
}

function OrganizationGridCard({ org }: { org: HomeOrganization }) {
  return (
    <article className="flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex flex-col items-center text-center">
        <CompanyLogo
          name={org.companyName}
          domain={org.companyDomain}
          logoUrl={org.companyLogoUrl}
          size={48}
          className="mb-3 size-12 rounded-lg"
        />
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <OrganizationPlanBadge plan={org.planName} />
          {org.isTrial ? <Badge variant="secondary">Trial</Badge> : null}
        </div>
        <h2 className="mt-2 text-base font-semibold tracking-tight">
          {org.companyName}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{org.location}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-left">
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Days remaining</p>
          <p
            className={cn(
              "text-sm font-medium tabular-nums",
              org.remainingDays <= 7 && "text-destructive"
            )}
          >
            {org.remainingDays}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Status</p>
          <Badge
            variant="outline"
            className={organizationStatusBadgeClassName(org.status)}
          >
            {subscriptionStatusLabels[org.status]}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Users</p>
          <StackedAvatars
            items={userAvatarItems(org.members, org.usersUsed)}
            total={org.usersUsed}
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Branches</p>
          <StackedAvatars
            items={branchAvatarItems(org.assignedBranches)}
            total={org.branchesUsed}
          />
        </div>
      </div>

      <div className="mt-5 w-full">
        <OrganizationActions org={org} fullWidth />
      </div>
    </article>
  )
}

export function CompanyListsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()

  const table = useDataTable({
    data: homeOrganizations,
    columns: organizationColumns,
    pageSize: homeOrganizations.length,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).toLowerCase()
      const org = row.original
      return (
        org.companyName.toLowerCase().includes(query) ||
        org.location.toLowerCase().includes(query) ||
        org.planName.toLowerCase().includes(query) ||
        org.status.toLowerCase().includes(query) ||
        org.id.toLowerCase().includes(query)
      )
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold tracking-tight">
            Your Organizations ({homeOrganizations.length})
          </h1>
          <div className="flex items-center rounded-md border bg-background p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={cn(
                "size-7",
                viewMode === "grid" &&
                  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              )}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={cn(
                "size-7",
                viewMode === "list" &&
                  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              )}
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>

        <Button nativeButton={false} render={<Link href="/onboarding/company" />}>
          <Plus data-icon="inline-start" />
          Add Organization
        </Button>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {homeOrganizations.map((org) => (
            <OrganizationGridCard key={org.id} org={org} />
          ))}
        </div>
      ) : (
        <DataTableCard
          table={table}
          columnCount={organizationColumns.length}
          searchPlaceholder="Search organizations..."
          rowSize={rowSize}
          onRowSizeChange={setRowSize}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          emptyMessage="No organizations found."
          showFilter={false}
          showPagination={false}
        />
      )}
    </div>
  )
}
