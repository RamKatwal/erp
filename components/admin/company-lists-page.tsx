"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, LayoutGrid, List, Plus } from "lucide-react"

import { CompanyLogo } from "@/components/company-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { organizations, type Organization } from "@/config/organizations"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

function planBadgeClassName(plan: string) {
  if (plan.toLowerCase().includes("enterprise")) {
    return "border-transparent bg-success/10 text-success"
  }
  if (plan.toLowerCase().includes("de-lite") || plan.toLowerCase().includes("lite")) {
    return "border-transparent bg-secondary text-secondary-foreground"
  }
  return "border-transparent bg-primary/10 text-primary"
}

function OrganizationPlanBadge({ plan }: { plan: string }) {
  return (
    <Badge className={cn("h-5 px-1.5 text-[10px] font-medium", planBadgeClassName(plan))}>
      {plan}
    </Badge>
  )
}

function OrganizationCard({
  org,
  viewMode,
}: {
  org: Organization
  viewMode: ViewMode
}) {
  const goToButton = (
    <Button
      variant="outline"
      nativeButton={false}
      className={cn(
        "border-primary text-primary hover:bg-primary/10 hover:text-primary",
        viewMode === "grid" ? "mt-5" : "shrink-0"
      )}
      render={<Link href="/" />}
    >
      Go to Organization
      <ArrowRight data-icon="inline-end" />
    </Button>
  )

  if (viewMode === "list") {
    return (
      <article className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo
            name={org.name}
            domain={org.domain}
            size={40}
            className="size-10 rounded-md"
          />
          <div className="min-w-0 space-y-1">
            <OrganizationPlanBadge plan={org.plan} />
            <h2 className="truncate text-sm font-semibold tracking-tight">
              {org.name}
            </h2>
            <p className="truncate text-sm text-muted-foreground">{org.location}</p>
          </div>
        </div>
        {goToButton}
      </article>
    )
  }

  return (
    <article className="flex flex-col items-center rounded-xl bg-card px-6 py-7 text-center ring-1 ring-foreground/10">
      <CompanyLogo
        name={org.name}
        domain={org.domain}
        size={48}
        className="mb-4 size-12 rounded-lg"
      />
      <OrganizationPlanBadge plan={org.plan} />
      <h2 className="mt-2 text-base font-semibold tracking-tight">{org.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{org.location}</p>
      {goToButton}
    </article>
  )
}

export function CompanyListsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")

  return (
    <div className="flex flex-col gap-6">
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} org={org} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} org={org} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  )
}
