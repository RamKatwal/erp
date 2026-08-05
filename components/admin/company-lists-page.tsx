"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, LayoutGrid, List, Plus } from "lucide-react"

import { organizations } from "@/config/organizations"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

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
                viewMode === "grid" && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
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
                viewMode === "list" && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              )}
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>

        <Button nativeButton={false} render={<Link href="/onboarding/company" />}>
          <Plus data-icon="inline-start" />
          Add New Organization
        </Button>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {organizations.map((org) => (
            <article
              key={org.id}
              className="flex flex-col items-center rounded-xl border bg-card px-6 py-8 text-center shadow-xs"
            >
              <div
                className={cn(
                  "mb-4 flex size-16 items-center justify-center rounded-lg text-2xl font-bold",
                  org.color
                )}
              >
                {org.initials}
              </div>
              <p className="text-xs text-muted-foreground">{org.plan}</p>
              <h2 className="mt-1 text-base font-semibold tracking-tight">
                {org.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{org.location}</p>
              <Button
                variant="outline"
                nativeButton={false}
                className="mt-6 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                render={<Link href="/" />}
              >
                Go to Organization
                <ArrowRight data-icon="inline-end" />
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {organizations.map((org) => (
            <article
              key={org.id}
              className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
                    org.color
                  )}
                >
                  {org.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{org.plan}</p>
                  <h2 className="truncate text-sm font-semibold tracking-tight">
                    {org.name}
                  </h2>
                  <p className="truncate text-sm text-muted-foreground">
                    {org.location}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                nativeButton={false}
                className="shrink-0 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                render={<Link href="/" />}
              >
                Go to Organization
                <ArrowRight data-icon="inline-end" />
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
