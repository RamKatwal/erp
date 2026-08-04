"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Add01Icon,
  Remove01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronDown } from "lucide-react"

import { PlanCompareDialog } from "@/components/onboarding/plan-compare-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  ADDITIONAL_MODULES,
  calculatePricing,
  formatNpr,
  PERIOD_MONTH_MULTIPLIER,
  PAYMENT_METHODS,
  PAYMENT_PERIODS,
  PLANS,
  type AdditionalModuleId,
  type PaymentMethodId,
  type PaymentPeriod,
  type PlanId,
} from "@/lib/onboarding/plans"
import {
  DEFAULT_PLAN_SELECTION,
  loadPlanSelection,
  savePlanSelection,
  type OnboardingPlanSelection,
} from "@/lib/onboarding/storage"
import { cn } from "@/lib/utils"

function NumberStepper({
  label,
  value,
  min = 1,
  onChange,
}: {
  label: string
  value: number
  min?: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <HugeiconsIcon icon={Remove01Icon} className="size-3.5" />
        </Button>
        <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
        >
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default function PlanSelectionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")?.trim() ?? ""

  const [selection, setSelection] =
    React.useState<OnboardingPlanSelection>(DEFAULT_PLAN_SELECTION)
  const [hydrated, setHydrated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [paymentError, setPaymentError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const stored = loadPlanSelection()
    if (stored) setSelection(stored)
    setHydrated(true)
  }, [])

  const pricing = calculatePricing({
    planId: selection.planId,
    users: selection.users,
    period: selection.period,
    branchesEnabled: selection.branchesEnabled,
    branchCount: selection.branchCount,
    moduleIds: selection.moduleIds,
  })

  const selectedPlan = PLANS.find((p) => p.id === selection.planId) ?? PLANS[1]
  const selectedPeriodLabel =
    PAYMENT_PERIODS.find((p) => p.id === selection.period)?.label ?? "Monthly"

  const periodPriceHint =
    selectedPlan.monthlyPerUser === 0
      ? "Free"
      : `${formatNpr(
          selectedPlan.monthlyPerUser *
            selection.users *
            (PERIOD_MONTH_MULTIPLIER[selection.period] ?? 1)
        )} / ${pricing.periodLabel}`

  function update(partial: Partial<OnboardingPlanSelection>) {
    setSelection((prev) => ({ ...prev, ...partial }))
    setPaymentError(null)
  }

  function selectPlan(planId: PlanId) {
    update({ planId })
  }

  function selectPeriod(period: PaymentPeriod) {
    update({ period })
  }

  function selectPayment(method: PaymentMethodId) {
    update({ paymentMethod: method })
  }

  function toggleModule(moduleId: AdditionalModuleId) {
    setSelection((prev) => {
      const exists = prev.moduleIds.includes(moduleId)
      return {
        ...prev,
        moduleIds: exists
          ? prev.moduleIds.filter((id) => id !== moduleId)
          : [...prev.moduleIds, moduleId],
      }
    })
    setPaymentError(null)
  }

  function handleContinue() {
    if (!pricing.isFree && !selection.paymentMethod) {
      setPaymentError("Select eSewa or Fonepay to continue.")
      return
    }

    const payload: OnboardingPlanSelection = {
      ...selection,
      paymentMethod: pricing.isFree ? null : selection.paymentMethod,
    }
    savePlanSelection(payload)
    setIsLoading(true)

    const companyPath = email
      ? `/onboarding/company?email=${encodeURIComponent(email)}`
      : "/onboarding/company"

    setTimeout(() => {
      setIsLoading(false)
      router.push(companyPath)
    }, 700)
  }

  const ctaLabel = pricing.isFree
    ? "Continue"
    : `Pay ${formatNpr(pricing.total)}`

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner size={24} variant="default" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Choose your plan
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Select a plan, customize users and billing, then complete checkout to
          continue setup.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div className="flex flex-col gap-8">
          <fieldset className="flex flex-col gap-3" aria-label="Plans">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Plans</span>
              <PlanCompareDialog
                selectedPlanId={selection.planId}
                onSelectPlan={selectPlan}
              />
            </div>
            {PLANS.map((plan) => {
              const isSelected = selection.planId === plan.id
              const unitLabel =
                plan.monthlyPerUser === 0
                  ? "Free"
                  : `${formatNpr(plan.monthlyPerUser)} /user /mo`

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => selectPlan(plan.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background"
                    )}
                    aria-hidden
                  >
                    {isSelected ? (
                      <HugeiconsIcon icon={Tick02Icon} className="size-2.5" />
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {plan.name}
                      </span>
                      <span className="text-sm font-medium tabular-nums text-foreground">
                        {unitLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </fieldset>

          <div className="flex flex-col gap-5 rounded-lg border border-border p-4 md:p-5">
            <p className="text-sm font-medium text-foreground">Customization</p>

            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Payment period
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {periodPriceHint}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 min-w-36 justify-between gap-2 px-3 text-sm font-normal"
                    />
                  }
                >
                  {selectedPeriodLabel}
                  <ChevronDown className="size-3.5 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-36">
                  {PAYMENT_PERIODS.map((period) => (
                    <DropdownMenuItem
                      key={period.id}
                      onClick={() => selectPeriod(period.id)}
                    >
                      {period.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <NumberStepper
              label="No. of users"
              value={selection.users}
              onChange={(users) => update({ users })}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    No. of branches
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Enable multi-branch and set count
                  </span>
                </div>
                <Switch
                  checked={selection.branchesEnabled}
                  onCheckedChange={(checked) =>
                    update({ branchesEnabled: Boolean(checked) })
                  }
                />
              </div>
              {selection.branchesEnabled ? (
                <NumberStepper
                  label="Branches"
                  value={selection.branchCount}
                  onChange={(branchCount) => update({ branchCount })}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">Includes</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedPlan.includes.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">
                Additional modules
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {ADDITIONAL_MODULES.map((mod) => {
                  const isSelected = selection.moduleIds.includes(mod.id)
                  return (
                    <div
                      key={mod.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleModule(mod.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          toggleModule(mod.id)
                        }
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {mod.name}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {formatNpr(mod.monthlyPrice)} /monthly
                        </p>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        tabIndex={-1}
                        aria-hidden
                        className="pointer-events-none"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="sticky top-24 flex flex-col gap-5 rounded-lg border border-border bg-muted/20 p-5 lg:p-6">
          <h2 className="text-base font-semibold tracking-tight">
            Order summary
          </h2>

          <dl className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                {pricing.planName}
                {selection.users > 1 ? ` × ${selection.users}` : ""}
                <span> · {pricing.periodLabel}</span>
              </dt>
              <dd className="font-medium tabular-nums">
                {formatNpr(pricing.planSubtotal)}
              </dd>
            </div>
            {pricing.branchesSubtotal > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  Branches × {selection.branchCount}
                </dt>
                <dd className="font-medium tabular-nums">
                  {formatNpr(pricing.branchesSubtotal)}
                </dd>
              </div>
            ) : null}
            {pricing.moduleLines.map((line) => (
              <div key={line.id} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{line.name}</dt>
                <dd className="font-medium tabular-nums">
                  {formatNpr(line.amount)}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-border pt-2.5">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium tabular-nums">
                {formatNpr(pricing.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">VAT (13%)</dt>
              <dd className="font-medium tabular-nums">
                {formatNpr(pricing.tax)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2.5 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold tabular-nums">
                {formatNpr(pricing.total)}
              </dd>
            </div>
          </dl>

          {!pricing.isFree ? (
            <div className="flex flex-col gap-2.5">
              <p className="text-sm font-medium text-foreground">
                Payment method
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selection.paymentMethod === method.id
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => selectPayment(method.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-lg border px-3 py-3 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-background hover:border-muted-foreground/40"
                      )}
                    >
                      <span className="flex h-9 w-full items-center justify-center rounded-md bg-black px-2">
                        <img
                          src={method.logoSrc}
                          alt={method.name}
                          className="h-6 w-auto max-w-full object-contain"
                        />
                      </span>
                      <span className="text-[11px] leading-snug text-muted-foreground">
                        {method.description}
                      </span>
                    </button>
                  )
                })}
              </div>
              {paymentError ? (
                <p className="text-xs text-destructive">{paymentError}</p>
              ) : null}
            </div>
          ) : (
            <p className="rounded-md bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              Free trial — no payment required. You can upgrade later from
              billing settings.
            </p>
          )}

          <Button
            type="button"
            className="h-10 w-full"
            disabled={isLoading}
            onClick={handleContinue}
          >
            {isLoading ? <Spinner size={18} variant="default" /> : ctaLabel}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Payments are secure. Mock checkout for demo only.
          </p>
        </aside>
      </div>
    </div>
  )
}
