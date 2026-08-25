"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CircleCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ORG_CREATED_COMPANY_ID_QUERY,
  ORG_CREATED_QUERY,
  isOrgCreatedQuery,
} from "@/lib/admin/organization-created"
import { homeOrganizations } from "@/lib/admin/home-organizations"
import {
  getIncompleteOrganizationSetups,
  getOrganizationSetupByCompanyId,
} from "@/lib/admin/organization-setup"
import { loadOnboardingSessionClient } from "@/lib/onboarding/client-session"
import { loadWorkspaceSubscriptionClient } from "@/lib/onboarding/entitlement"
import {
  enterCompanyPortal,
  getActiveBranches,
} from "@/lib/companies/portal-context"
import { getCompanyById } from "@/lib/companies/options"

function resolveCreatedCompany(companyIdFromQuery: string | null): {
  companyId: string | null
  companyName: string | null
} {
  const session = loadOnboardingSessionClient()
  const workspace = loadWorkspaceSubscriptionClient()

  const companyId =
    companyIdFromQuery?.trim() ||
    session?.companyId ||
    workspace?.companyId ||
    null

  if (!companyId) {
    return {
      companyId: null,
      companyName: session?.company?.companyName ?? workspace?.companyName ?? null,
    }
  }

  const fromHome = homeOrganizations.find((org) => org.companyId === companyId)
  const companyName =
    fromHome?.companyName ??
    (session?.companyId === companyId ? session.company?.companyName : null) ??
    (workspace?.companyId === companyId ? workspace.companyName : null) ??
    null

  return { companyId, companyName }
}

export function OrganizationCreatedDialog() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const createdFlag = searchParams.get(ORG_CREATED_QUERY)
  const companyIdParam = searchParams.get(ORG_CREATED_COMPANY_ID_QUERY)

  const [open, setOpen] = React.useState(false)
  const [companyId, setCompanyId] = React.useState<string | null>(null)
  const [companyName, setCompanyName] = React.useState<string | null>(null)
  const navigatingAwayRef = React.useRef(false)

  React.useEffect(() => {
    if (!isOrgCreatedQuery(createdFlag)) {
      setOpen(false)
      navigatingAwayRef.current = false
      return
    }

    if (navigatingAwayRef.current) return

    const resolved = resolveCreatedCompany(companyIdParam)
    setCompanyId(resolved.companyId)
    setCompanyName(resolved.companyName)
    setOpen(true)
  }, [createdFlag, companyIdParam])

  function dismissToHome() {
    navigatingAwayRef.current = true
    setOpen(false)
    router.replace("/admin", { scroll: false })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setOpen(true)
      return
    }
    // Ignore close events fired while we navigate to setup / company
    if (navigatingAwayRef.current) {
      setOpen(false)
      return
    }
    dismissToHome()
  }

  function handleCompleteSetup() {
    navigatingAwayRef.current = true
    setOpen(false)

    const hasSetup =
      companyId != null && Boolean(getOrganizationSetupByCompanyId(companyId))
    const targetId = hasSetup
      ? companyId
      : (getIncompleteOrganizationSetups()[0]?.org.companyId ??
        homeOrganizations[0]?.companyId ??
        companyId)

    router.replace(
      targetId ? `/admin/companies/${targetId}/setup` : "/admin"
    )
  }

  function handleGoToCompany() {
    navigatingAwayRef.current = true
    setOpen(false)

    if (companyId) {
      const company = getCompanyById(companyId)
      const branch = company ? getActiveBranches(company)[0] : null
      if (company && branch) {
        enterCompanyPortal(company.id, branch.id)
      }
    }

    router.replace("/")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CircleCheckIcon className="size-6" strokeWidth={1.75} aria-hidden />
          </div>
          <DialogTitle className="text-base font-semibold">
            Organization created successfully
          </DialogTitle>
          <DialogDescription>
            {companyName ? (
              <>
                <span className="font-medium text-foreground">{companyName}</span>{" "}
                is ready. Complete setup now, open the company workspace, or
                stay on Home.
              </>
            ) : (
              <>
                Your organization is ready. Complete setup now, open the company
                workspace, or stay on Home.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button type="button" className="w-full" onClick={handleCompleteSetup}>
            Complete setup now
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoToCompany}
          >
            Go to company
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={dismissToHome}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
