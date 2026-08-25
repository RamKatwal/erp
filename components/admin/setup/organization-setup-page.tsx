"use client"

import Link from "next/link"
import { ArrowLeft, CircleCheckIcon, CircleDashedIcon } from "lucide-react"

import {
  organizationPlanBadgeClassName,
  organizationStatusBadgeClassName,
} from "@/components/admin/organization-columns"
import { SetupProgressBar } from "@/components/admin/setup/setup-progress-bar"
import { CompanyAvatar } from "@/components/company-logo"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getOrganizationSetupByCompanyId,
  SETUP_STEP_COUNT,
  type ResolvedSetupStep,
} from "@/lib/admin/organization-setup"
import { cn } from "@/lib/utils"
import { subscriptionStatusLabels } from "@/types/subscription"

function StepStatusIcon({ step }: { step: ResolvedSetupStep }) {
  if (step.complete) {
    return (
      <CircleCheckIcon
        className="size-4 shrink-0 text-success"
        strokeWidth={1.75}
        aria-label="Complete"
      />
    )
  }

  return (
    <CircleDashedIcon
      className="size-4 shrink-0 text-muted-foreground"
      strokeWidth={1.75}
      aria-label="Incomplete"
    />
  )
}

function SetupStepRow({ step }: { step: ResolvedSetupStep }) {
  return (
    <li className="flex flex-col gap-3 border-b px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5">
          <StepStatusIcon step={step} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{step.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {step.description}
          </p>
          {step.locked ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Complete chart of accounts first.
            </p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 sm:pl-4">
        {step.complete ? (
          <span className="text-xs font-medium text-muted-foreground">Done</span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
            render={<Link href={step.href} />}
          >
            {step.blocking ? "Fix now" : "Set up"}
          </Button>
        )}
      </div>
    </li>
  )
}

export function OrganizationSetupPage({ companyId }: { companyId: string }) {
  const progress = getOrganizationSetupByCompanyId(companyId)

  if (!progress) {
    return null
  }

  const { org, steps, completedCount, percent } = progress
  const blockingStep = steps.find((step) => step.blocking && !step.complete)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Setup checklist"
        breadcrumb={
          <Button
            variant="link"
            size="sm"
            className="mb-0.5 h-auto self-start px-0 text-muted-foreground"
            nativeButton={false}
            render={<Link href="/admin" />}
          >
            <ArrowLeft />
            Back to Home
          </Button>
        }
      />

      <section className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <CompanyAvatar
              name={org.companyName}
              domain={org.companyDomain}
              logoUrl={org.companyLogoUrl}
              size="lg"
              showTooltip={false}
              avatarClassName="size-10"
            />
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold tracking-tight">
                {org.companyName}
              </h2>
              <p className="truncate text-sm text-muted-foreground">
                {org.location}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge
                  className={cn(
                    "h-5 px-1.5 text-[10px] font-medium",
                    organizationPlanBadgeClassName(org.planName)
                  )}
                >
                  {org.planName}
                </Badge>
                {org.isTrial ? <Badge variant="secondary">Trial</Badge> : null}
                <Badge
                  variant="outline"
                  className={organizationStatusBadgeClassName(org.status)}
                >
                  {subscriptionStatusLabels[org.status]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            {completedCount} of {SETUP_STEP_COUNT} complete
          </p>
          <SetupProgressBar percent={percent} />
        </div>
      </section>

      {blockingStep ? (
        <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
          <p className="text-sm font-medium">{blockingStep.title} needs attention</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {blockingStep.description}
          </p>
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            className="mt-3 border-primary text-primary hover:bg-primary/10 hover:text-primary"
            render={<Link href={blockingStep.href} />}
          >
            Fix now
          </Button>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <ul>
          {steps.map((step) => (
            <SetupStepRow key={step.id} step={step} />
          ))}
        </ul>
      </section>
    </div>
  )
}
