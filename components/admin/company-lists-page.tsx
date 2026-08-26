"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { LayoutGrid, List, Plus } from "lucide-react"

import {
  organizationStatusBadgeClassName,
  getOrganizationColumns,
} from "@/components/admin/organization-columns"
import { OrganizationSetupDialog } from "@/components/admin/setup/organization-setup-dialog"
import { SetupProgressBar } from "@/components/admin/setup/setup-progress-bar"
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
  getHomeOrganizations,
  homeOrganizations,
  organizationNeedsUpgrade,
  subscribeHomeOrganizations,
  syncWorkspaceOrgIntoHomeOrganizations,
  type HomeOrganization,
} from "@/lib/admin/home-organizations"
import {
  getOrganizationSetupProgress,
  SETUP_STEP_COUNT,
  setupStageLabel,
  subscribeSetupOverrides,
  type OrganizationSetupProgress,
} from "@/lib/admin/organization-setup"
import { cn } from "@/lib/utils"
import { subscriptionStatusLabels } from "@/types/subscription"

type ViewMode = "grid" | "list"

const SETUP_QUERY = "setup"

function formatCount(value: number): string {
  return value > 0 ? String(value) : "—"
}

function OrganizationCardFooter({
  org,
  setup,
  onContinueSetup,
}: {
  org: HomeOrganization
  setup: OrganizationSetupProgress
  onContinueSetup: (companyId: string) => void
}) {
  const needsUpgrade = organizationNeedsUpgrade(org)
  const setupIncomplete = setup.completedCount < SETUP_STEP_COUNT

  if (setupIncomplete) {
    return (
      <div className="mt-4 flex flex-col gap-3 border-t pt-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">Setup progress</p>
            <p className="truncate text-[11px] font-medium text-muted-foreground tabular-nums">
              {setup.completedCount} of {SETUP_STEP_COUNT} ·{" "}
              {setupStageLabel(setup.completedCount)}
            </p>
          </div>
          <SetupProgressBar percent={setup.percent} className="h-1" />
        </div>

        {needsUpgrade ? (
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            className="w-full"
            render={<Link href={`/admin/subscriptions/${org.id}`} />}
          >
            Upgrade
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => onContinueSetup(org.companyId)}
          >
            Continue setup
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 border-t pt-4">
      {needsUpgrade ? (
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          className="w-full"
          render={<Link href={`/admin/subscriptions/${org.id}`} />}
        >
          Upgrade
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          className="w-full"
          render={<Link href="/" />}
        >
          Go to company
        </Button>
      )}
    </div>
  )
}

function OrganizationGridCard({
  org,
  onContinueSetup,
}: {
  org: HomeOrganization
  onContinueSetup: (companyId: string) => void
}) {
  const setup = getOrganizationSetupProgress(org)

  return (
    <article className="flex flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex flex-col gap-1">
        <CompanyLogo
          name={org.companyName}
          domain={org.companyDomain}
          logoUrl={org.companyLogoUrl}
          size={36}
          className="size-9 rounded-md"
        />
        <p className="mt-2 text-xs text-muted-foreground">{org.planName}</p>
        <h2 className="text-base font-semibold tracking-tight">
          {org.companyName}
        </h2>
        <p className="text-sm text-muted-foreground">{org.location}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] text-muted-foreground">Days remaining</p>
          <p className="text-sm font-medium tabular-nums">{org.remainingDays}</p>
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] text-muted-foreground">Status</p>
          <Badge
            variant="outline"
            className={cn(
              "h-5 max-w-full truncate px-1.5 text-[10px] font-medium",
              organizationStatusBadgeClassName(org.status)
            )}
          >
            {subscriptionStatusLabels[org.status]}
          </Badge>
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] text-muted-foreground">Users</p>
          <p className="text-sm font-medium tabular-nums">
            {formatCount(org.usersUsed)}
          </p>
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] text-muted-foreground">Branches</p>
          <p className="text-sm font-medium tabular-nums">
            {formatCount(org.branchesUsed)}
          </p>
        </div>
      </div>

      <OrganizationCardFooter
        org={org}
        setup={setup}
        onContinueSetup={onContinueSetup}
      />
    </article>
  )
}

export function CompanyListsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [rowSize, setRowSize] = React.useState<DataTableRowSize>("md")
  const [organizations, setOrganizations] =
    React.useState<HomeOrganization[]>(homeOrganizations)
  const [setupCompanyId, setSetupCompanyId] = React.useState<string | null>(
    null
  )
  const [, setSetupTick] = React.useState(0)
  const { isFullscreen, toggleFullscreen } = useDataTableFullscreen()

  React.useEffect(() => {
    syncWorkspaceOrgIntoHomeOrganizations()
    setOrganizations(getHomeOrganizations())
    return subscribeHomeOrganizations(() => {
      setOrganizations(getHomeOrganizations())
    })
  }, [])

  React.useEffect(() => {
    return subscribeSetupOverrides(() => {
      setSetupTick((value) => value + 1)
    })
  }, [])

  React.useEffect(() => {
    const setupId = searchParams.get(SETUP_QUERY)
    if (!setupId) return
    setSetupCompanyId(setupId)
    const params = new URLSearchParams(searchParams.toString())
    params.delete(SETUP_QUERY)
    const next = params.toString()
    router.replace(next ? `/admin?${next}` : "/admin")
  }, [router, searchParams])

  const openSetup = React.useCallback((companyId: string) => {
    setSetupCompanyId(companyId)
  }, [])

  const columns = React.useMemo(
    () => getOrganizationColumns({ onContinueSetup: openSetup }),
    [openSetup]
  )

  const table = useDataTable({
    data: organizations,
    columns,
    pageSize: Math.max(organizations.length, 1),
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
            Your Organizations ({organizations.length})
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
          {organizations.map((org) => (
            <OrganizationGridCard
              key={org.id}
              org={org}
              onContinueSetup={openSetup}
            />
          ))}
        </div>
      ) : (
        <DataTableCard
          table={table}
          columnCount={columns.length}
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

      <OrganizationSetupDialog
        companyId={setupCompanyId}
        open={Boolean(setupCompanyId)}
        onOpenChange={(open) => {
          if (!open) setSetupCompanyId(null)
        }}
      />
    </div>
  )
}
