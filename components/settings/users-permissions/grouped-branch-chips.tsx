"use client"

import type { MouseEvent, ReactNode } from "react"
import { XIcon } from "lucide-react"

import {
  getBranchesByIds,
  groupBranchesByCompany,
  type ResolvedBranchOption,
} from "@/lib/companies/options"
import { cn } from "@/lib/utils"

type StatusChipTone = {
  dot: string
}

const statusChipBaseClass =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-xs font-normal leading-none text-foreground"

const companyTones: StatusChipTone[] = [
  { dot: "bg-sky-500" },
  { dot: "bg-violet-500" },
  { dot: "bg-emerald-500" },
  { dot: "bg-amber-500" },
  { dot: "bg-rose-500" },
  { dot: "bg-teal-500" },
] as const

export function getCompanyTone(companyId: string): StatusChipTone {
  let hash = 0
  for (const char of companyId) {
    hash = (hash + char.charCodeAt(0)) % companyTones.length
  }
  return companyTones[hash]
}

export function branchChipLabel(branch: ResolvedBranchOption) {
  return branch.isHeadOffice ? "Head Office" : branch.name
}

export function StatusChip({
  label,
  tone,
  className,
}: {
  label: string
  tone: StatusChipTone
  className?: string
}) {
  return (
    <span className={cn(statusChipBaseClass, className)}>
      <span
        className={cn("size-1.5 shrink-0 rounded-full", tone.dot)}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </span>
  )
}

export function RemovableStatusChip({
  label,
  tone,
  onRemove,
  removeLabel,
}: {
  label: string
  tone: StatusChipTone
  onRemove: (event: MouseEvent) => void
  removeLabel: string
}) {
  return (
    <span className={cn(statusChipBaseClass, "gap-1 py-0.5 pr-1 pl-2")}>
      <span
        className={cn("size-1.5 shrink-0 rounded-full", tone.dot)}
        aria-hidden
      />
      <span className="truncate">{label}</span>
      <span
        role="button"
        tabIndex={-1}
        aria-label={removeLabel}
        className="rounded-sm text-muted-foreground opacity-70 hover:opacity-100"
        onClick={onRemove}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onRemove(event as unknown as MouseEvent)
          }
        }}
      >
        <XIcon className="size-3" />
      </span>
    </span>
  )
}

function ChipRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {children}
    </div>
  )
}

export function groupedBranchAccessSearchText(branchIds: string[]) {
  return getBranchesByIds(branchIds)
    .map(
      (branch) =>
        `${branch.companyName} ${branchChipLabel(branch)} ${branch.code}`
    )
    .join(" ")
}

type BranchChipListProps = {
  branchIds: string[]
  emptyLabel?: string
  className?: string
}

export function CompanyAccessChips({
  branchIds,
  emptyLabel = "—",
  className,
}: BranchChipListProps) {
  const groups = groupBranchesByCompany(branchIds)

  if (groups.length === 0) {
    return <span className="text-muted-foreground">{emptyLabel}</span>
  }

  return (
    <ChipRow className={className}>
      {groups.map((group) => (
        <StatusChip
          key={group.companyId}
          label={group.companyName}
          tone={getCompanyTone(group.companyId)}
        />
      ))}
    </ChipRow>
  )
}

export function BranchAccessChips({
  branchIds,
  emptyLabel = "—",
  className,
}: BranchChipListProps) {
  const groups = groupBranchesByCompany(branchIds)

  if (groups.length === 0) {
    return <span className="text-muted-foreground">{emptyLabel}</span>
  }

  return (
    <ChipRow className={className}>
      {groups.flatMap((group) =>
        group.branches.map((branch) => (
          <StatusChip
            key={branch.id}
            label={branchChipLabel(branch)}
            tone={getCompanyTone(branch.companyId)}
          />
        ))
      )}
    </ChipRow>
  )
}

/** Stacked company + branch chips for detail panels and forms. */
export function GroupedBranchChips({
  branchIds,
  emptyLabel = "—",
  className,
}: BranchChipListProps) {
  const groups = groupBranchesByCompany(branchIds)

  if (groups.length === 0) {
    return <span className="text-muted-foreground">{emptyLabel}</span>
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {groups.map((group) => (
        <div key={group.companyId} className="flex flex-col gap-1">
          <StatusChip
            label={group.companyName}
            tone={getCompanyTone(group.companyId)}
          />
          <ChipRow>
            {group.branches.map((branch) => (
              <StatusChip
                key={branch.id}
                label={branchChipLabel(branch)}
                tone={getCompanyTone(branch.companyId)}
              />
            ))}
          </ChipRow>
        </div>
      ))}
    </div>
  )
}
