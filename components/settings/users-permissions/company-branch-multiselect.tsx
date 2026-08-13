"use client"

import * as React from "react"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  findCompanyForBranch,
  getBranchLabel,
  getCompanyById,
  getCompanyOptions,
} from "@/lib/companies/options"
import { cn } from "@/lib/utils"

export type CompanyBranchSelection = {
  companyIds: string[]
  branchIds: string[]
}

type CompanyBranchMultiselectProps = {
  value: CompanyBranchSelection
  onChange: (value: CompanyBranchSelection) => void
  placeholder?: string
  disabled?: boolean
  /** When set, only these branches (and their companies) are selectable. */
  allowedBranchIds?: string[]
  /** When false, closes the picker (e.g. parent dialog closed). */
  active?: boolean
  className?: string
  id?: string
  "aria-invalid"?: boolean
}

function deriveCompanyIds(branchIds: string[]) {
  const ids = new Set<string>()
  for (const branchId of branchIds) {
    const company = findCompanyForBranch(branchId)
    if (company) ids.add(company.id)
  }
  return Array.from(ids)
}

export function CompanyBranchMultiselect({
  value,
  onChange,
  placeholder = "Select companies & branches…",
  disabled,
  allowedBranchIds,
  active = true,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: CompanyBranchMultiselectProps) {
  const [open, setOpen] = React.useState(false)
  const allowedSet = React.useMemo(
    () => (allowedBranchIds ? new Set(allowedBranchIds) : null),
    [allowedBranchIds]
  )

  const companies = React.useMemo(() => {
    const all = getCompanyOptions()
    if (!allowedSet) return all

    return all
      .map((company) => ({
        ...company,
        branches: company.branches.filter((branch) => allowedSet.has(branch.id)),
      }))
      .filter((company) => company.branches.length > 0)
  }, [allowedSet])

  React.useEffect(() => {
    if (!active) {
      setOpen(false)
    }
  }, [active])

  const selectedLabels = value.branchIds.map((branchId) => {
    const company = findCompanyForBranch(branchId)
    const branchLabel = getBranchLabel(branchId) ?? branchId
    return {
      id: branchId,
      label: company ? `${company.name} · ${branchLabel}` : branchLabel,
    }
  })

  function applyBranchIds(nextBranchIds: string[]) {
    const filtered = allowedSet
      ? nextBranchIds.filter((id) => allowedSet.has(id))
      : nextBranchIds
    onChange({
      companyIds: deriveCompanyIds(filtered),
      branchIds: filtered,
    })
  }

  function toggleBranch(branchId: string) {
    if (allowedSet && !allowedSet.has(branchId)) return
    const selected = value.branchIds.includes(branchId)
    applyBranchIds(
      selected
        ? value.branchIds.filter((id) => id !== branchId)
        : [...value.branchIds, branchId]
    )
  }

  function removeBranch(branchId: string, event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    applyBranchIds(value.branchIds.filter((id) => id !== branchId))
  }

  const emptyHint =
    allowedSet && companies.length === 0
      ? "No companies or branches for this role"
      : "No company or branch found."

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled || (allowedSet !== null && companies.length === 0)}
            aria-invalid={ariaInvalid}
            aria-haspopup="dialog"
            className={cn(
              "h-auto min-h-9 w-full justify-between gap-2 px-3 py-1.5 font-normal",
              selectedLabels.length === 0 && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedLabels.length === 0 ? (
            <span>{placeholder}</span>
          ) : (
            selectedLabels.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className="max-w-full gap-1 rounded-md px-1.5 font-normal"
              >
                <span className="truncate">{item.label}</span>
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${item.label}`}
                  className="rounded-sm opacity-70 hover:opacity-100"
                  onClick={(event) => removeBranch(item.id, event)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      removeBranch(
                        item.id,
                        event as unknown as React.MouseEvent
                      )
                    }
                  }}
                >
                  <XIcon className="size-3" />
                </span>
              </Badge>
            ))
          )}
        </span>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[var(--anchor-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search companies or branches…" />
          <CommandList className="max-h-64">
            <CommandEmpty>{emptyHint}</CommandEmpty>

            {companies.map((company, index) => (
              <React.Fragment key={company.id}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={company.name}>
                  {company.branches.map((branch) => {
                    const checked = value.branchIds.includes(branch.id)

                    return (
                      <CommandItem
                        key={branch.id}
                        value={`${company.name} ${branch.name} ${branch.code} ${branch.isHeadOffice ? "head office headoffice hq" : ""}`}
                        data-checked={checked ? "true" : undefined}
                        onSelect={() => toggleBranch(branch.id)}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {branch.name}
                          {branch.isHeadOffice ? (
                            <span className="text-muted-foreground">
                              {" "}
                              · Head Office
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-[0.625rem] tracking-wide text-muted-foreground">
                          {branch.code}
                        </span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>

        <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
          <p className="text-[0.6875rem] text-muted-foreground">
            {value.branchIds.length === 0
              ? allowedSet
                ? "Pick from this role’s companies & branches"
                : "Pick any companies and branches"
              : `${value.companyIds.length} compan${value.companyIds.length === 1 ? "y" : "ies"}, ${value.branchIds.length} branch${value.branchIds.length === 1 ? "" : "es"}`}
          </p>
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function getCompanyNamesForIds(companyIds: string[]) {
  return companyIds
    .map((id) => getCompanyById(id)?.name)
    .filter((name): name is string => Boolean(name))
}
