"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckIcon, StarIcon } from "lucide-react"

import { organizationPlanBadgeClassName } from "@/components/admin/organization-columns"
import { SetupProgressBar } from "@/components/admin/setup/setup-progress-bar"
import { IconStack } from "@/components/reui/icon-stack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ORG_CREATED_COMPANY_ID_QUERY,
  ORG_CREATED_QUERY,
  isOrgCreatedQuery,
} from "@/lib/admin/organization-created"
import {
  getHomeOrganizationByCompanyId,
  homeOrganizations,
  locationFromCompanyDraft,
  syncWorkspaceOrgIntoHomeOrganizations,
  upsertHomeOrganizationFromSubscription,
} from "@/lib/admin/home-organizations"
import {
  getIncompleteOrganizationSetups,
  getOrganizationSetupByCompanyId,
  SETUP_STEP_COUNT,
} from "@/lib/admin/organization-setup"
import { getCompanyById } from "@/lib/companies/options"
import {
  enterCompanyPortal,
  getActiveBranches,
} from "@/lib/companies/portal-context"
import { loadOnboardingSessionClient } from "@/lib/onboarding/client-session"
import { loadWorkspaceSubscriptionClient } from "@/lib/onboarding/entitlement"
import { cn } from "@/lib/utils"

type CreatedCompany = {
  companyId: string | null
  companyName: string | null
  planName: string | null
}

function resolveCreatedCompany(companyIdFromQuery: string | null): CreatedCompany {
  const session = loadOnboardingSessionClient()
  const workspace = loadWorkspaceSubscriptionClient()

  const companyId =
    companyIdFromQuery?.trim() ||
    session?.companyId ||
    workspace?.companyId ||
    null

  if (workspace?.companyId) {
    const location =
      session?.company && session.companyId === workspace.companyId
        ? locationFromCompanyDraft(session.company)
        : undefined
    upsertHomeOrganizationFromSubscription(workspace, location)
  } else {
    syncWorkspaceOrgIntoHomeOrganizations()
  }

  const fromHome = companyId
    ? getHomeOrganizationByCompanyId(companyId)
    : undefined

  const companyName =
    fromHome?.companyName ??
    (session?.companyId === companyId ? session.company?.companyName : null) ??
    (workspace?.companyId === companyId ? workspace.companyName : null) ??
    session?.company?.companyName ??
    workspace?.companyName ??
    null

  const planName =
    fromHome?.planName ??
    (workspace?.companyId === companyId ? workspace.planName : null) ??
    session?.entitlement?.planName ??
    workspace?.planName ??
    null

  return { companyId, companyName, planName }
}

export function OrganizationCreatedDialog() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const createdFlag = searchParams.get(ORG_CREATED_QUERY)
  const companyIdParam = searchParams.get(ORG_CREATED_COMPANY_ID_QUERY)

  const [open, setOpen] = React.useState(false)
  const [company, setCompany] = React.useState<CreatedCompany>({
    companyId: null,
    companyName: null,
    planName: null,
  })
  const navigatingAwayRef = React.useRef(false)

  React.useEffect(() => {
    if (!isOrgCreatedQuery(createdFlag)) {
      setOpen(false)
      navigatingAwayRef.current = false
      return
    }

    if (navigatingAwayRef.current) return

    setCompany(resolveCreatedCompany(companyIdParam))
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
    if (navigatingAwayRef.current) {
      setOpen(false)
      return
    }
    dismissToHome()
  }

  function handleCompleteSetup() {
    navigatingAwayRef.current = true
    setOpen(false)

    const { companyId } = company
    const hasSetup =
      companyId != null && Boolean(getOrganizationSetupByCompanyId(companyId))
    const targetId = hasSetup
      ? companyId
      : (getIncompleteOrganizationSetups()[0]?.org.companyId ??
        homeOrganizations[0]?.companyId ??
        companyId)

    router.replace(targetId ? `/admin?setup=${targetId}` : "/admin")
  }

  function handleGoToCompany() {
    navigatingAwayRef.current = true
    setOpen(false)

    if (company.companyId) {
      const option = getCompanyById(company.companyId)
      const branch = option ? getActiveBranches(option)[0] : null
      if (option && branch) {
        enterCompanyPortal(option.id, branch.id)
      }
    }

    router.replace("/")
  }

  const displayName = company.companyName ?? "Your organization"
  const planName = company.planName

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden p-0 sm:max-w-sm"
      >
        <div className="flex flex-col items-center pt-10 text-center">
          <div className="flex flex-col items-center px-6">
            <IconStack aria-hidden="true" className="text-success">
              <CheckIcon className="size-4 text-success" strokeWidth={2.5} />
            </IconStack>

            <DialogTitle className="mt-5 text-lg font-semibold tracking-tight text-foreground">
              {displayName} is ready
            </DialogTitle>
            <DialogDescription className="sr-only">
              Organization created successfully. Continue setup or open the
              company workspace.
            </DialogDescription>

            {planName ? (
              <Badge
                className={cn(
                  "mt-2 h-5 px-1.5 text-[10px] font-medium",
                  organizationPlanBadgeClassName(planName)
                )}
              >
                {planName}
              </Badge>
            ) : null}
          </div>

          <div className="mt-6 w-full space-y-1.5 border-y border-border px-6 py-4 text-left">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-muted-foreground">Setup progress</p>
              <p className="truncate text-[11px] font-medium text-muted-foreground tabular-nums">
                0 of {SETUP_STEP_COUNT}
              </p>
            </div>
            <SetupProgressBar percent={0} className="h-1" />
          </div>

          <div className="flex w-full flex-col gap-2.5 px-6 pt-5 pb-6">
            <Button
              type="button"
              className="w-full"
              onClick={handleCompleteSetup}
            >
              <StarIcon data-icon="inline-start" />
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
