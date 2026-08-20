"use client"

import Link from "next/link"
import { CheckCircle2Icon } from "lucide-react"

import { CompanyAvatar } from "@/components/company-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  attentionIssueLabels,
  type AttentionIssueType,
  type NeedsAttentionItem,
} from "@/lib/admin/home-metrics"
import { formatLongDate } from "@/lib/format"
import { cn } from "@/lib/utils"

function issueBadgeClassName(issueType: AttentionIssueType) {
  switch (issueType) {
    case "payment_failed":
      return "border-transparent bg-destructive/10 text-destructive"
    case "trial_expiring":
      return "border-transparent bg-warning/15 text-warning-foreground dark:text-warning"
    case "near_branch_limit":
      return "border-transparent bg-primary/10 text-primary"
    case "subscription_error":
    default:
      return "border-border text-muted-foreground"
  }
}

type NeedsAttentionPanelProps = {
  items: NeedsAttentionItem[]
}

export function NeedsAttentionPanel({ items }: NeedsAttentionPanelProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border bg-card shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">Needs Attention</h2>
          <p className="text-xs text-muted-foreground">
            Cross-tenant items that need action today
          </p>
        </div>
        {items.length > 0 ? (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {items.length}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <CheckCircle2Icon
            className="size-8 text-success"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-sm text-muted-foreground">
            Nothing needs attention right now.
          </p>
        </div>
      ) : (
        <ul className="divide-y">
          {items.map((item) => {
            const ctaLabel =
              item.issueType === "payment_failed" ||
              item.issueType === "subscription_error"
                ? "Resolve"
                : "View"

            return (
              <li
                key={item.id}
                className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <CompanyAvatar
                    name={item.companyName}
                    domain={item.companyDomain}
                    showTooltip={false}
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-medium">
                        {item.companyName}
                      </p>
                      <Badge
                        className={cn(
                          "h-5 rounded-full px-1.5 text-[10px] font-medium",
                          issueBadgeClassName(item.issueType)
                        )}
                      >
                        {attentionIssueLabels[item.issueType]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      {formatLongDate(item.date)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 self-start sm:self-center"
                  nativeButton={false}
                  render={<Link href={item.href} />}
                >
                  {ctaLabel}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
