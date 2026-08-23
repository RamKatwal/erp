"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CompanyLogo } from "@/components/company-logo"
import { Button } from "@/components/ui/button"
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
import { readActiveBranchId } from "@/lib/branches/storage"
import {
  getCompanyOptions,
  type CompanyBranchOption,
} from "@/lib/companies/options"
import {
  enterCompanyPortal,
  getActiveBranches,
  readActiveCompanyId,
} from "@/lib/companies/portal-context"
import { formatShortcutParts } from "@/lib/keyboard/utils"
import { cn } from "@/lib/utils"

const HEAD_OFFICE_HREF = "/"

function branchLabel(branch: CompanyBranchOption) {
  return branch.isHeadOffice ? "Head office" : branch.name
}

export function AdminGoToCompany() {
  const router = useRouter()
  const isMac = useIsMac()
  const [open, setOpen] = React.useState(false)
  const [lastCompanyId, setLastCompanyId] = React.useState<string | null>(null)
  const [lastBranchId, setLastBranchId] = React.useState<string | null>(null)

  const companies = React.useMemo(() => getCompanyOptions(), [])
  const reachableCompanies = React.useMemo(
    () => companies.filter((company) => getActiveBranches(company).length > 0),
    [companies]
  )

  const switchPortalShortcut = formatShortcutParts(
    ["Mod", "Shift", "A"],
    isMac
  )

  React.useEffect(() => {
    setLastCompanyId(readActiveCompanyId())
    setLastBranchId(readActiveBranchId())
  }, [])

  function goToPortal(companyId: string, branchId: string) {
    const entered = enterCompanyPortal(companyId, branchId)
    if (!entered) return

    setLastCompanyId(entered.company.id)
    setLastBranchId(entered.branch.id)
    setOpen(false)
    router.push(HEAD_OFFICE_HREF)
  }

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="sm"
                    aria-label={`Go to Company (${switchPortalShortcut})`}
                  />
                }
              />
            }
          >
            Go to Company
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
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

        <DropdownMenuContent
          align="end"
          className="thin-scrollbar min-w-64 max-w-72 max-h-80 overflow-y-auto"
        >
          {reachableCompanies.length === 0 ? (
            <DropdownMenuItem disabled>No companies available</DropdownMenuItem>
          ) : (
            reachableCompanies.map((company, index) => {
              const branches = getActiveBranches(company)
              const isActiveCompany = company.id === lastCompanyId

              return (
                <React.Fragment key={company.id}>
                  {index > 0 ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center gap-2 text-foreground">
                      <CompanyLogo
                        name={company.name}
                        domain={company.domain}
                        size={14}
                        className="size-3.5 rounded-[3px]"
                      />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {company.name}
                      </span>
                      <span className="shrink-0 font-normal text-muted-foreground">
                        {branches.length} branch
                        {branches.length === 1 ? "" : "es"}
                      </span>
                    </DropdownMenuLabel>
                    {branches.map((branch) => {
                      const isActive =
                        isActiveCompany && branch.id === lastBranchId

                      return (
                        <DropdownMenuItem
                          key={branch.id}
                          onClick={() => goToPortal(company.id, branch.id)}
                          className={cn(
                            "gap-2 pl-7",
                            isActive && "bg-primary/10 focus:bg-primary/10"
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {branchLabel(branch)}
                          </span>
                          {isActive ? (
                            <HugeiconsIcon
                              icon={Tick02Icon}
                              strokeWidth={2}
                              className="size-3.5 shrink-0 text-primary"
                            />
                          ) : null}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuGroup>
                </React.Fragment>
              )
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
