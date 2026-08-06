"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowDown01Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMac } from "@/hooks/use-is-mac"
import { mockBranches } from "@/lib/mock/branches"
import { readBranches } from "@/lib/branches/storage"
import { formatShortcutParts } from "@/lib/keyboard/utils"
import type { Branch } from "@/types/branch"

const HEAD_OFFICE_HREF = "/"

function branchInitials(branch: Branch) {
  return branch.code.slice(0, 2).toUpperCase()
}

export function AdminGoToCompany() {
  const router = useRouter()
  const isMac = useIsMac()
  const [branches, setBranches] = React.useState<Branch[]>(mockBranches)
  const switchPortalShortcut = formatShortcutParts(
    ["Mod", "Shift", "A"],
    isMac
  )

  React.useEffect(() => {
    setBranches(readBranches())
  }, [])

  const accessibleBranches = branches.filter(
    (branch) => branch.status === "active"
  )

  function goToPortal() {
    router.push(HEAD_OFFICE_HREF)
  }

  return (
    <ButtonGroup aria-label="Go to company">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                size="sm"
                onClick={goToPortal}
                aria-label={`Go to Company (${switchPortalShortcut})`}
              />
            }
          >
            <HugeiconsIcon icon={Building01Icon} strokeWidth={2} />
            Go to Company
          </TooltipTrigger>
          <TooltipContent side="bottom" className="flex items-center gap-1.5">
            <span>Go to Company</span>
            <kbd
              data-slot="kbd"
              className="pointer-events-none inline-flex h-5 items-center rounded border border-background/20 bg-background/15 px-1.5 font-mono text-[10px] font-medium text-background"
            >
              {switchPortalShortcut}
            </kbd>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ButtonGroupSeparator className="bg-primary-foreground/20" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="sm"
              className="px-2"
              aria-label="Select branch"
            />
          }
        >
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Branches</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {accessibleBranches.length === 0 ? (
              <DropdownMenuItem disabled>No active branches</DropdownMenuItem>
            ) : (
              accessibleBranches.map((branch) => (
                <DropdownMenuItem
                  key={branch.id}
                  onClick={goToPortal}
                  className="gap-2"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold">
                    {branchInitials(branch)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                    <span className="truncate font-medium">{branch.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {branch.code}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
