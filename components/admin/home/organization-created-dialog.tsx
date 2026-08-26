"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { m, useReducedMotion } from "framer-motion"

import { CompanyLogo } from "@/components/company-logo"
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
} from "@/lib/admin/organization-setup"
import { getCompanyById } from "@/lib/companies/options"
import {
  enterCompanyPortal,
  getActiveBranches,
} from "@/lib/companies/portal-context"
import { loadOnboardingSessionClient } from "@/lib/onboarding/client-session"
import { loadWorkspaceSubscriptionClient } from "@/lib/onboarding/entitlement"
import { withReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type CreatedCompany = {
  companyId: string | null
  companyName: string | null
  planName: string | null
  companyDomain: string | null
  companyLogoUrl: string | null
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

  return {
    companyId,
    companyName,
    planName,
    companyDomain:
      fromHome?.companyDomain ??
      (workspace?.companyId === companyId ? workspace.companyDomain : null) ??
      null,
    companyLogoUrl: fromHome?.companyLogoUrl ?? null,
  }
}

function AnimatedSuccessTick({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const circleTransition = withReducedMotion(
    { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    reduceMotion
  )
  const checkTransition = withReducedMotion(
    { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: reduceMotion ? 0 : 0.2 },
    reduceMotion
  )

  return (
    <div
      className={cn(
        "flex size-14 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-foreground/5",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 48 48" className="size-8 text-success" fill="none">
        <m.circle
          cx="24"
          cy="24"
          r="18"
          stroke="currentColor"
          strokeWidth="2.5"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={circleTransition}
        />
        <m.path
          d="M15.5 24.5 21.2 30.2 32.5 18.5"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={checkTransition}
        />
      </svg>
    </div>
  )
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
    companyDomain: null,
    companyLogoUrl: null,
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
  const displayPlan = company.planName ?? "Plan ready"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
      >
        <div className="relative bg-success/15 px-6 pb-5 pt-8 text-center">
          <div className="flex flex-col items-center gap-3">
            {open ? <AnimatedSuccessTick /> : null}
            <div className="space-y-1">
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                Organization created
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Your new company workspace is ready to go
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-card px-5 py-5">
          <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-3">
            <CompanyLogo
              name={displayName}
              domain={company.companyDomain}
              logoUrl={company.companyLogoUrl}
              size={40}
              className="size-10 shrink-0 rounded-lg"
            />
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold tracking-tight">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {displayPlan}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
