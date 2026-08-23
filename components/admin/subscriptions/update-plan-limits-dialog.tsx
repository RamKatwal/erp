"use client"

import * as React from "react"
import {
  Add01Icon,
  Remove01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  BRANCH_MONTHLY_PRICE,
  calculatePricing,
  DEFAULT_PAYMENT_METHOD_ID,
  formatNpr,
  PAYMENT_METHODS,
  PERIOD_MONTH_MULTIPLIER,
  VAT_RATE,
  type PaymentMethodId,
  type PaymentPeriod,
  type PlanId,
} from "@/lib/onboarding/plans"
import { formatCurrency, formatLongDate } from "@/lib/format"
import type { Subscription } from "@/types/subscription"

type UpdatePlanLimitsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  mode: "branches" | "users"
  onConfirm: (
    branchesLimit: number,
    usersLimit: number,
    paymentMethod: PaymentMethodId,
    amountPaid: number
  ) => void
}

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

function subscriptionPeriod(subscription: Subscription): PaymentPeriod {
  return subscription.interval === "year" ? "annually" : "monthly"
}

function pricingFor({
  subscription,
  branchesEnabled,
  branchesLimit,
  usersLimit,
}: {
  subscription: Subscription
  branchesEnabled: boolean
  branchesLimit: number
  usersLimit: number
}) {
  return calculatePricing({
    planId: subscription.planId as PlanId,
    users: usersLimit,
    period: subscriptionPeriod(subscription),
    branchesEnabled,
    branchCount: Math.max(1, branchesLimit),
    moduleIds: [],
  })
}

/** Charge only for newly added branches (current quota stays paid). */
function additionalBranchesDue(subscription: Subscription, count: number) {
  if (count <= 0) {
    return { taxable: 0, tax: 0, total: 0 }
  }
  const period = subscriptionPeriod(subscription)
  const multiplier = PERIOD_MONTH_MULTIPLIER[period] ?? 1
  const taxable =
    Math.round(BRANCH_MONTHLY_PRICE * count * multiplier * 100) / 100
  const tax = Math.round(taxable * VAT_RATE * 100) / 100
  const total = Math.round((taxable + tax) * 100) / 100
  return { taxable, tax, total }
}

export function UpdatePlanLimitsDialog({
  open,
  onOpenChange,
  subscription,
  mode,
  onConfirm,
}: UpdatePlanLimitsDialogProps) {
  const currentBranches = subscription.branchesLimit
  const hasExistingBranches = currentBranches > 0

  const [branchesEnabled, setBranchesEnabled] = React.useState(
    hasExistingBranches
  )
  /** Extra branches to purchase on top of the current paid limit. */
  const [additionalBranches, setAdditionalBranches] = React.useState(1)
  const [users, setUsers] = React.useState(subscription.usersLimit)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodId>(
    subscription.paymentMethod?.provider ?? DEFAULT_PAYMENT_METHOD_ID
  )
  const [isLoading, setIsLoading] = React.useState(false)

  const addingBranches =
    mode === "branches" && (hasExistingBranches || branchesEnabled)
      ? additionalBranches
      : 0

  const nextBranchesLimit =
    mode === "branches"
      ? currentBranches + addingBranches
      : subscription.branchesLimit
  const nextUsersLimit = mode === "users" ? users : subscription.usersLimit

  const branchDue = additionalBranchesDue(subscription, addingBranches)

  const currentUserPricing = React.useMemo(
    () =>
      pricingFor({
        subscription,
        branchesEnabled: subscription.branchesLimit > 0,
        branchesLimit: Math.max(1, subscription.branchesLimit || 1),
        usersLimit: subscription.usersLimit,
      }),
    [subscription]
  )
  const nextUserPricing = React.useMemo(
    () =>
      pricingFor({
        subscription,
        branchesEnabled: subscription.branchesLimit > 0,
        branchesLimit: Math.max(1, subscription.branchesLimit || 1),
        usersLimit: nextUsersLimit,
      }),
    [subscription, nextUsersLimit]
  )

  const amountPaid =
    mode === "branches"
      ? branchDue.total
      : Math.max(0, nextUserPricing.total - currentUserPricing.total)

  const hasChanges =
    mode === "branches"
      ? addingBranches > 0
      : users !== subscription.usersLimit

  const title =
    mode === "branches" ? "Update branch allocations" : "Update user seats"

  const periodDisplayLabel =
    subscription.interval === "year" ? "Annually" : "Monthly"

  React.useEffect(() => {
    if (!open) return
    setBranchesEnabled(subscription.branchesLimit > 0)
    setAdditionalBranches(1)
    setUsers(subscription.usersLimit)
    setPaymentMethod(
      subscription.paymentMethod?.provider ?? DEFAULT_PAYMENT_METHOD_ID
    )
    setIsLoading(false)
  }, [open, subscription])

  function handleConfirm() {
    if (!hasChanges || isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onConfirm(nextBranchesLimit, nextUsersLimit, paymentMethod, amountPaid)
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "branches"
              ? "Add extra branches on top of your current paid allocation."
              : "Review the order details and confirm payment to update your current plan."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {mode === "branches" ? (
            <div className="flex flex-col gap-3 rounded-lg bg-card px-4 py-4 ring-1 ring-foreground/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    No. of branches
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {hasExistingBranches
                      ? `${currentBranches} already paid · choose how many to add`
                      : "Enable multi-branch and set count"}
                  </span>
                </div>
                <Switch
                  checked={hasExistingBranches || branchesEnabled}
                  disabled={hasExistingBranches}
                  onCheckedChange={(checked) =>
                    setBranchesEnabled(Boolean(checked))
                  }
                />
              </div>
              {hasExistingBranches || branchesEnabled ? (
                <NumberStepper
                  label="Additional branches"
                  value={additionalBranches}
                  min={1}
                  onChange={setAdditionalBranches}
                />
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg bg-card px-4 py-4 ring-1 ring-foreground/10">
              <NumberStepper
                label="No. of users"
                value={users}
                min={Math.max(1, subscription.usersUsed)}
                onChange={setUsers}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Currently using {subscription.usersUsed}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10">
          <dl className="flex flex-col gap-2.5 px-4 py-3.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="shrink-0 font-medium text-foreground">
                {subscription.planName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Current billing</dt>
              <dd className="shrink-0 font-medium text-foreground">
                {formatLongDate(subscription.periodEnd)}
              </dd>
            </div>

            {mode === "branches" ? (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Current branches</dt>
                  <dd className="shrink-0 tabular-nums text-foreground">
                    {currentBranches}
                    <span className="ml-1 text-muted-foreground">
                      (already paid)
                    </span>
                  </dd>
                </div>
                {addingBranches > 0 ? (
                  <>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">
                        Branches × {addingBranches} ({periodDisplayLabel})
                      </dt>
                      <dd className="shrink-0 tabular-nums text-foreground">
                        {formatNpr(branchDue.taxable)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">VAT</dt>
                      <dd className="shrink-0 tabular-nums text-foreground">
                        {formatNpr(branchDue.tax)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">New total</dt>
                      <dd className="shrink-0 font-medium tabular-nums text-foreground">
                        {nextBranchesLimit}
                      </dd>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">User seats</dt>
                <dd className="shrink-0 font-medium tabular-nums text-foreground">
                  {subscription.usersLimit} → {nextUsersLimit}
                </dd>
              </div>
            )}
          </dl>

          <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3.5 text-sm">
            <span className="text-muted-foreground">
              {amountPaid === 0
                ? "No additional payment required"
                : "Amount due now"}
            </span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                amountPaid ? "text-primary" : "text-muted-foreground"
              )}
            >
              {formatCurrency(amountPaid, subscription.currency)}
            </span>
          </div>
        </div>

        {amountPaid > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium text-foreground">Payment method</p>
            <div className="grid grid-cols-2 gap-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex h-12 cursor-pointer items-center gap-2.5 rounded-lg bg-card px-3 text-left text-card-foreground ring-1 ring-foreground/10 transition-colors",
                      isSelected
                        ? "ring-2 ring-primary"
                        : "hover:ring-foreground/20"
                    )}
                  >
                    <img
                      src={method.logoSrc}
                      alt=""
                      aria-hidden
                      className="size-6 shrink-0 object-contain"
                    />
                    <span className="truncate text-sm font-medium">
                      {method.name}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Payment is simulated (demo) — confirm to apply your updated
              limits.
            </p>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!hasChanges || isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? (
              <Spinner size={18} variant="default" />
            ) : amountPaid > 0 ? (
              `Pay ${formatCurrency(amountPaid, subscription.currency)}`
            ) : (
              "Confirm changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
