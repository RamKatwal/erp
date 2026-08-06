"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  readActiveBranchId,
  readBranches,
  resolveActiveBranch,
  saveActiveBranchId,
} from "@/lib/branches/storage"
import { mockBranches } from "@/lib/mock/branches"
import { cn } from "@/lib/utils"
import type { Branch } from "@/types/branch"

function branchInitials(branch: Branch) {
  return branch.code.slice(0, 2).toUpperCase()
}

function BranchMark({
  branch,
  className,
}: {
  branch: Branch
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-foreground",
        className
      )}
    >
      {branchInitials(branch)}
    </span>
  )
}

export function BranchSwitcher({ className }: { className?: string }) {
  const [branches, setBranches] = React.useState<Branch[]>(mockBranches)
  const [activeBranchId, setActiveBranchId] = React.useState(
    () => mockBranches[0]?.id ?? ""
  )

  React.useEffect(() => {
    const nextBranches = readBranches()
    setBranches(nextBranches)
    const active = resolveActiveBranch(nextBranches)
    if (active) {
      setActiveBranchId(active.id)
      if (readActiveBranchId() !== active.id) {
        saveActiveBranchId(active.id)
      }
    }
  }, [])

  const accessibleBranches = branches.filter(
    (branch) => branch.status === "active"
  )
  const activeBranch =
    accessibleBranches.find((branch) => branch.id === activeBranchId) ??
    accessibleBranches[0] ??
    null

  function selectBranch(branch: Branch) {
    setActiveBranchId(branch.id)
    saveActiveBranchId(branch.id)
  }

  if (!activeBranch) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Switch branch"
            className={cn(
              "inline-flex h-9 w-full max-w-56 min-w-0 cursor-pointer items-center gap-2 rounded-lg border bg-background px-2 py-1 text-left outline-none transition-colors",
              "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/30",
              "data-popup-open:border-ring data-popup-open:bg-muted/50 data-popup-open:ring-2 data-popup-open:ring-ring/20",
              className
            )}
          />
        }
      >
        <BranchMark branch={activeBranch} />
        <div className="grid min-w-0 flex-1 gap-0.5 leading-none">
          <span className="truncate text-sm font-medium text-foreground">
            {activeBranch.name}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {activeBranch.code}
          </span>
        </div>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Branches</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {accessibleBranches.map((branch) => (
            <DropdownMenuItem
              key={branch.id}
              onClick={() => selectBranch(branch)}
              className="gap-2"
            >
              <BranchMark branch={branch} className="size-6" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                <span className="truncate font-medium">{branch.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {branch.code}
                  {branch.address ? ` · ${branch.address}` : null}
                </span>
              </span>
              {branch.id === activeBranch.id ? (
                <Check className="size-4 shrink-0 text-foreground" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
