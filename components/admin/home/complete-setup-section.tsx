"use client"

import Link from "next/link"
import { CircleCheckIcon, CircleDashedIcon } from "lucide-react"

import { CompanyAvatar } from "@/components/company-logo"
import { SetupProgressBar } from "@/components/admin/setup/setup-progress-bar"
import { Button } from "@/components/ui/button"
import {
  getIncompleteOrganizationSetups,
  SETUP_STEP_COUNT,
  type OrganizationSetupProgress,
} from "@/lib/admin/organization-setup"
import { cn } from "@/lib/utils"

function SetupPreviewItem({
  title,
  complete,
}: {
  title: string
  complete: boolean
}) {
  return (
    <li className="flex items-center gap-2 text-xs text-muted-foreground">
      {complete ? (
        <CircleCheckIcon
          className="size-3.5 shrink-0 text-success"
          strokeWidth={1.75}
          aria-hidden
        />
      ) : (
        <CircleDashedIcon
          className="size-3.5 shrink-0 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
      <span className={cn("truncate", complete && "text-foreground/80")}>
        {title}
      </span>
    </li>
  )
}

function IncompleteOrgCard({ progress }: { progress: OrganizationSetupProgress }) {
  const { org, completedCount, percent, previewSteps } = progress

  return (
    <article className="flex min-w-[280px] flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center gap-2.5">
        <CompanyAvatar
          name={org.companyName}
          domain={org.companyDomain}
          logoUrl={org.companyLogoUrl}
          showTooltip={false}
        />
        <h3 className="min-w-0 truncate text-sm font-semibold tracking-tight">
          {org.companyName}
        </h3>
      </div>

      <p className="mt-3 text-xs text-muted-foreground tabular-nums">
        {completedCount} of {SETUP_STEP_COUNT} setup steps complete
      </p>
      <SetupProgressBar percent={percent} className="mt-2" />

      <ul className="mt-3 flex min-h-[2.75rem] flex-col gap-1.5">
        {previewSteps.map((step) => (
          <SetupPreviewItem
            key={step.id}
            title={step.title}
            complete={step.complete}
          />
        ))}
      </ul>

      <Button
        size="sm"
        variant="outline"
        nativeButton={false}
        className="mt-4 w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
        render={<Link href={`/admin/companies/${org.companyId}/setup`} />}
      >
        Continue setup
      </Button>
    </article>
  )
}

export function CompleteSetupSection() {
  const incomplete = getIncompleteOrganizationSetups()

  if (incomplete.length === 0) return null

  const countLabel =
    incomplete.length === 1
      ? "1 organization needs attention"
      : `${incomplete.length} organizations need attention`

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold tracking-tight">
          Complete your setup
        </h2>
        <p className="text-xs text-muted-foreground">{countLabel}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {incomplete.map((progress) => (
          <IncompleteOrgCard key={progress.org.companyId} progress={progress} />
        ))}
      </div>
    </section>
  )
}
