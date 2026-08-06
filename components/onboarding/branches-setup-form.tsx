"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DemoFillFab } from "@/components/demo-fill-fab"
import { QuickBranchesTable } from "@/components/onboarding/quick-branches-table"
import { SettingUpScreen } from "@/components/onboarding/setting-up-screen"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  saveActiveBranchId,
  saveBranches,
  todayIsoDate,
} from "@/lib/branches/storage"
import {
  getBranchLimit,
  persistBranchLimit,
} from "@/lib/branches/subscription"
import {
  buildDefaultBranchRows,
  companyCodePrefix,
  DEMO_BRANCH_LOCATIONS,
  generateBranchCode,
  resequenceBranchCodes,
  type QuickBranchRow,
} from "@/lib/onboarding/branch-draft"
import {
  clearCompanyDraft,
  loadCompanyDraft,
  type OnboardingCompanyDraft,
} from "@/lib/onboarding/company-storage"
import { clearPlanSelection } from "@/lib/onboarding/storage"
import type { Branch } from "@/types/branch"

type RowErrors = Record<string, Partial<Record<keyof QuickBranchRow, string>>>

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateRows(rows: QuickBranchRow[]): RowErrors {
  const errors: RowErrors = {}
  const seenCodes = new Set<string>()

  rows.forEach((row) => {
    const rowError: Partial<Record<keyof QuickBranchRow, string>> = {}

    if (!row.name.trim()) {
      rowError.name = "Required"
    }
    if (!row.location.trim()) {
      rowError.location = "Required"
    }
    if (!row.code.trim()) {
      rowError.code = "Required"
    } else if (!/^[A-Za-z0-9_-]+$/.test(row.code.trim())) {
      rowError.code = "Invalid"
    } else {
      const normalized = row.code.trim().toUpperCase()
      if (seenCodes.has(normalized)) {
        rowError.code = "Duplicate"
      } else {
        seenCodes.add(normalized)
      }
    }
    if (row.contactEmail.trim() && !isValidEmail(row.contactEmail.trim())) {
      rowError.contactEmail = "Invalid email"
    }

    if (Object.keys(rowError).length > 0) {
      errors[row.id] = rowError
    }
  })

  return errors
}

function rowsToBranches(rows: QuickBranchRow[]): Branch[] {
  const createdAt = todayIsoDate()
  const stamp = Date.now()
  return rows.map((row, index) => {
    const code = row.code.trim().toUpperCase()
    const slug = code
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    return {
      id: `br-${slug || "branch"}-${stamp}-${index}`,
      name: row.name.trim(),
      code,
      address: row.location.trim(),
      contactNumber: row.contactNumber.trim(),
      contactEmail: row.contactEmail.trim(),
      status: "active" as const,
      createdAt,
    }
  })
}

function headOfficeFromCompany(
  company: OnboardingCompanyDraft,
  prefix: string
): Branch {
  const name = "Head Office"
  const location = [company.district || company.fullAddress, company.province]
    .filter(Boolean)
    .join(", ")
  const code = generateBranchCode(prefix, location || "HQ", 0)
  const slug = code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return {
    id: `br-${slug || "hq"}-${Date.now()}`,
    name,
    code,
    address: location || company.fullAddress,
    contactNumber: "",
    contactEmail: "",
    status: "active",
    createdAt: todayIsoDate(),
  }
}

export default function BranchesSetupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")?.trim() ?? ""
  const emailQuery = email ? `?email=${encodeURIComponent(email)}` : ""

  const [company, setCompany] = React.useState<OnboardingCompanyDraft | null>(
    null
  )
  const [companyPrefix, setCompanyPrefix] = React.useState("BRN")
  const [branchLimit, setBranchLimit] = React.useState(1)
  const [rows, setRows] = React.useState<QuickBranchRow[]>([])
  const [errors, setErrors] = React.useState<RowErrors>({})
  const [isSettingUp, setIsSettingUp] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const draft = loadCompanyDraft()
    if (!draft) {
      router.replace(`/onboarding/company${emailQuery}`)
      return
    }

    const limit = getBranchLimit()
    const prefix = companyCodePrefix(draft.companyName)
    setCompany(draft)
    setCompanyPrefix(prefix)
    setBranchLimit(limit)
    setRows(buildDefaultBranchRows(limit, draft))
    setHydrated(true)
  }, [emailQuery, router])

  function finishSetup(branches: Branch[]) {
    setIsSettingUp(true)

    persistBranchLimit(branchLimit)
    saveBranches(branches)
    if (branches[0]) {
      saveActiveBranchId(branches[0].id)
    }
    clearCompanyDraft()
    clearPlanSelection()

    window.setTimeout(() => {
      router.push("/admin")
    }, 2800)
  }

  function handleSkip() {
    if (!company || isSettingUp) return
    finishSetup([headOfficeFromCompany(company, companyPrefix)])
  }

  function handleCreateBranches() {
    if (rows.length === 0) return
    const nextErrors = validateRows(rows)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    finishSetup(rowsToBranches(rows))
  }

  function fillDemoBranches() {
    setRows((current) =>
      resequenceBranchCodes(
        current.map((row, index) => {
          if (index === 0) {
            return {
              ...row,
              contactNumber: "",
              contactEmail: "",
              codeAuto: true,
            }
          }
          const location =
            DEMO_BRANCH_LOCATIONS[(index - 1) % DEMO_BRANCH_LOCATIONS.length]
          return {
            ...row,
            location,
            contactNumber: "",
            contactEmail: "",
            codeAuto: true,
          }
        }),
        companyPrefix
      )
    )
    setErrors({})
  }

  if (!hydrated) {
    return null
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <PageHeader
          title="Quick branch setup"
          count={`${branchLimit} / ${branchLimit}`}
          description="Fill each branch from your plan. Type in cells or paste from Excel, then save all at once."
          actions={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSettingUp}
                onClick={handleSkip}
              >
                Skip — add later
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSettingUp || rows.length === 0}
                onClick={handleCreateBranches}
              >
                Save all
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4"
                  data-icon="inline-end"
                />
              </Button>
            </div>
          }
        />

        <div className="flex max-h-[min(36rem,65svh)] min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="flex flex-col gap-2 border-b px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Codes use company prefix{" "}
              <span className="font-mono font-medium text-foreground">
                {companyPrefix}
              </span>
              , e.g.{" "}
              <span className="font-mono text-foreground">
                {companyPrefix}-KTM-01
              </span>
            </p>
            <span className="text-xs text-muted-foreground">
              Contact &amp; email optional · Paste from spreadsheet supported
            </span>
          </div>

          <QuickBranchesTable
            rows={rows}
            companyPrefix={companyPrefix}
            disabled={isSettingUp}
            onChange={(next) => {
              setRows(next)
              setErrors({})
            }}
            errors={errors}
            className="min-h-0"
          />

          <div className="flex flex-col-reverse gap-2 border-t bg-muted/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {rows.length} branch{rows.length === 1 ? "" : "es"} ready to create
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSettingUp}
                onClick={handleSkip}
              >
                Skip — add later
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSettingUp || rows.length === 0}
                onClick={handleCreateBranches}
              >
                Save all ({rows.length})
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4"
                  data-icon="inline-end"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SettingUpScreen open={isSettingUp} />

      {!isSettingUp ? (
        <DemoFillFab label="Fill demo branches" onFill={fillDemoBranches} />
      ) : null}
    </>
  )
}
