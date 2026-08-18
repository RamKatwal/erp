"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

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
import { cn } from "@/lib/utils"
import {
  calculatePricing,
  DEFAULT_PAYMENT_METHOD_ID,
  PAYMENT_METHODS,
  type PaymentMethodId,
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

function Stepper({
  label,
  description,
  value,
  min,
  onChange,
}: {
  label: string
  description: string
  value: number
  min: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <MinusIcon className="size-3.5" />
        </Button>
        <span className="w-10 text-center text-sm font-semibold tabular-nums">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          <PlusIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function pricingFor({
  subscription,
  branchesLimit,
  usersLimit,
}: {
  subscription: Subscription
  branchesLimit: number
  usersLimit: number
}) {
  const period = subscription.interval === "year" ? "annually" : "monthly"
  return calculatePricing({
    planId: subscription.planId as PlanId,
    users: usersLimit,
    period,
    branchesEnabled: true,
    branchCount: Math.max(1, branchesLimit),
    moduleIds: [],
  })
}

export function UpdatePlanLimitsDialog({
  open,
  onOpenChange,
  subscription,
  mode,
  onConfirm,
}: UpdatePlanLimitsDialogProps) {
  const [branches, setBranches] = React.useState(subscription.branchesLimit)
  const [users, setUsers] = React.useState(subscription.usersLimit)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodId>(
    subscription.paymentMethod?.provider ?? DEFAULT_PAYMENT_METHOD_ID
  )
  const [isLoading, setIsLoading] = React.useState(false)

  const nextBranchesLimit =
    mode === "branches" ? branches : subscription.branchesLimit
  const nextUsersLimit = mode === "users" ? users : subscription.usersLimit

  const currentPricing = React.useMemo(
    () =>
      pricingFor({
        subscription,
        branchesLimit: subscription.branchesLimit,
        usersLimit: subscription.usersLimit,
      }),
    [subscription]
  )
  const nextPricing = React.useMemo(
    () =>
      pricingFor({
        subscription,
        branchesLimit: nextBranchesLimit,
        usersLimit: nextUsersLimit,
      }),
    [subscription, nextBranchesLimit, nextUsersLimit]
  )

  const amountPaid = Math.max(0, nextPricing.total - currentPricing.total)
  const hasChanges =
    mode === "branches"
      ? branches !== subscription.branchesLimit
      : users !== subscription.usersLimit

  const title =
    mode === "branches" ? "Update branch allocations" : "Update user seats"

  const dueLabel =
    amountPaid === 0 ? "No additional payment required" : "Amount due now"

  React.useEffect(() => {
    if (!open) return
    setBranches(subscription.branchesLimit)
    setUsers(subscription.usersLimit)
    setPaymentMethod(subscription.paymentMethod?.provider ?? DEFAULT_PAYMENT_METHOD_ID)
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
            Review the order details and confirm payment to update your
            current plan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {mode === "branches" ? (
            <Stepper
              label="Branches"
              description={`Currently using ${subscription.branchesUsed}`}
              value={branches}
              min={Math.max(1, subscription.branchesUsed)}
              onChange={setBranches}
            />
          ) : (
            <Stepper
              label="User seats"
              description={`Currently using ${subscription.usersUsed}`}
              value={users}
              min={Math.max(1, subscription.usersUsed)}
              onChange={setUsers}
            />
          )}
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium">{subscription.planName}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Current billing</span>
            <span className="font-medium">{formatLongDate(subscription.periodEnd)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              {mode === "branches" ? "Branches" : "User seats"}
            </span>
            <span className="font-medium">
              {mode === "branches"
                ? `${subscription.branchesLimit} → ${nextBranchesLimit}`
                : `${subscription.usersLimit} → ${nextUsersLimit}`}
            </span>
          </div>

          <div className="mt-3 border-t pt-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{dueLabel}</span>
              <span className={cn("font-semibold tabular-nums", amountPaid ? "text-primary" : "text-muted-foreground")}>
                {amountPaid
                  ? formatCurrency(amountPaid, subscription.currency)
                  : formatCurrency(0, subscription.currency)}
              </span>
            </div>
          </div>
        </div>

        {amountPaid > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium">Payment method</p>
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
                      "flex h-12 cursor-pointer items-center gap-2 rounded-lg bg-card px-3 text-left ring-1 ring-foreground/10 transition-colors",
                      isSelected ? "ring-2 ring-primary" : "hover:ring-foreground/20"
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
              Payment is simulated (demo) — confirm to apply your updated limits.
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
            ) : (
              amountPaid > 0 ? `Pay ${formatCurrency(amountPaid, subscription.currency)}` : "Confirm changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
