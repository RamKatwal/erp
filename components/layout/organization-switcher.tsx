"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { organizations, type Organization } from "@/config/organizations"
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
  readActiveOrganizationId,
  resolveActiveOrganization,
  saveActiveOrganizationId,
} from "@/lib/organizations/storage"
import { cn } from "@/lib/utils"

function OrganizationMark({
  org,
  className,
}: {
  org: Organization
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
        org.color,
        className
      )}
    >
      {org.initials}
    </span>
  )
}

export function OrganizationSwitcher({ className }: { className?: string }) {
  const [activeOrgId, setActiveOrgId] = React.useState<Organization["id"]>(
    organizations[0].id
  )

  React.useEffect(() => {
    const active = resolveActiveOrganization()
    if (active) {
      setActiveOrgId(active.id)
      if (readActiveOrganizationId() !== active.id) {
        saveActiveOrganizationId(active.id)
      }
    }
  }, [])

  const activeOrg =
    organizations.find((org) => org.id === activeOrgId) ?? organizations[0]

  function selectOrganization(org: Organization) {
    setActiveOrgId(org.id)
    saveActiveOrganizationId(org.id)
  }

  if (!activeOrg) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Switch organization"
            className={cn(
              "inline-flex h-auto w-full max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border bg-background px-2 py-1 text-left outline-none transition-colors",
              "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/30",
              "data-popup-open:border-ring data-popup-open:bg-muted/50 data-popup-open:ring-2 data-popup-open:ring-ring/20",
              "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:max-w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hover:bg-sidebar-accent",
              className
            )}
          />
        }
      >
        <OrganizationMark org={activeOrg} />
        <div className="grid min-w-0 flex-1 gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span className="truncate text-sm font-medium text-foreground">
            {activeOrg.name}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {activeOrg.location}
          </span>
        </div>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/70 group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => selectOrganization(org)}
              className="gap-2"
            >
              <OrganizationMark org={org} className="size-6" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                <span className="truncate font-medium">{org.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {org.location}
                </span>
              </span>
              {org.id === activeOrg.id ? (
                <Check className="size-4 shrink-0 text-foreground" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
