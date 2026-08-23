"use client"

import * as React from "react"
import { Add01Icon, Remove01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  additionalBranchesDue,
  additionalUsersDue,
  invoiceChargeTypeFor,
} from "@/components/admin/subscriptions/billing-utils"
import { OrderPaymentPanel } from "@/components/admin/subscriptions/order-payment-panel"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { formatLongDate } from "@/lib/format"
import {
  DEFAULT_PAYMENT_METHOD_ID,
  formatNpr,
  type PaymentMethodId,
} from "@/lib/onboarding/plans"
import type { InvoiceChargeType, Subscription } from "@/types/subscription"

export type UpdatePlanLimitsResult = {
  branchesLimit: number
  usersLimit: number
  paymentMethod: PaymentMethodId
  amountPaid: number
  chargeType: InvoiceChargeType
  addedBranches: number
  addedUsers: number
}

type UpdatePlanLimitsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  focus: "branches" | "users"
  onConfirm: (result: UpdatePlanLimitsResult) => void
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

export function UpdatePlanLimitsDialog({
  open,
  onOpenChange,
  subscription,
  focus,
  onConfirm,
}: UpdatePlanLimitsDialogProps) {
  const currentBranches = subscription.branchesLimit
  const currentUsers = subscription.usersLimit
  const hasExistingBranches = currentBranches > 0

  const [extraEnabled, setExtraEnabled] = React.useState(false)
  const [branchesEnabled, setBranchesEnabled] = React.useState(
    hasExistingBranches
  )
  const [additionalBranches, setAdditionalBranches] = React.useState(1)
  const [additionalUsers, setAdditionalUsers] = React.useState(1)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodId>(
    subscription.paymentMethod?.provider ?? DEFAULT_PAYMENT_METHOD_ID
  )
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setExtraEnabled(false)
    setBranchesEnabled(subscription.branchesLimit > 0)
    setAdditionalBranches(1)
    setAdditionalUsers(1)
    setPaymentMethod(
      subscription.paymentMethod?.provider ?? DEFAULT_PAYMENT_METHOD_ID
    )
    setIsLoading(false)
  }, [open, subscription])

  const includeBranches = focus === "branches" || extraEnabled
  const includeUsers = focus === "users" || extraEnabled

  const addingBranches =
    includeBranches && (hasExistingBranches || branchesEnabled)
      ? additionalBranches
      : 0
  const addingUsers = includeUsers ? additionalUsers : 0

  const nextBranchesLimit = currentBranches + addingBranches
  const nextUsersLimit = currentUsers + addingUsers

  const branchDue = additionalBranchesDue(subscription, addingBranches)
  const userDue = additionalUsersDue(subscription, addingUsers)
  const taxable = branchDue.taxable + userDue.taxable
  const tax = branchDue.tax + userDue.tax
  const amountPaid = branchDue.total + userDue.total
  const hasChanges = addingBranches > 0 || addingUsers > 0
  const chargeType = invoiceChargeTypeFor(addingBranches, addingUsers)
  const periodLabel =
    subscription.interval === "year" ? "Annually" : "Monthly"
  const extraLabel =
    focus === "branches" ? "Also add user seats" : "Also add branches"
  const title =
    includeBranches && includeUsers
      ? "Update plan limits"
      : focus === "branches"
        ? "Update branch allocations"
        : "Update user seats"

  const orderLines = [
    { label: "Plan", value: subscription.planName },
    {
      label: "Current billing",
      value: formatLongDate(subscription.periodEnd),
    },
    ...(addingBranches > 0
      ? [
          {
            label: `Additional branches × ${addingBranches} (${periodLabel})`,
            value: formatNpr(branchDue.taxable),
          },
        ]
      : []),
    ...(addingUsers > 0
      ? [
          {
            label: `Additional users × ${addingUsers} (${periodLabel})`,
            value: formatNpr(userDue.taxable),
          },
        ]
      : []),
    ...(taxable > 0
      ? [
          { label: "Taxable amount", value: formatNpr(taxable) },
          { label: "VAT", value: formatNpr(tax) },
        ]
      : []),
  ]

  function handleConfirm() {
    if (!hasChanges || isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onConfirm({
        branchesLimit: nextBranchesLimit,
        usersLimit: nextUsersLimit,
        paymentMethod,
        amountPaid,
        chargeType,
        addedBranches: addingBranches,
        addedUsers: addingUsers,
      })
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(860px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add extra allocations on top of your current paid plan. Review the
            order on the right and confirm payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 overflow-hidden sm:grid-cols-[minmax(0,1fr)_minmax(17rem,19rem)]">
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-5">
            {includeBranches ? (
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
            ) : null}

            {includeUsers ? (
              <div className="flex flex-col gap-1.5 rounded-lg bg-card px-4 py-4 ring-1 ring-foreground/10">
                <NumberStepper
                  label="Additional users"
                  value={additionalUsers}
                  min={1}
                  onChange={setAdditionalUsers}
                />
                <p className="text-xs text-muted-foreground">
                  {currentUsers} seats already paid · currently using{" "}
                  {subscription.usersUsed}
                </p>
              </div>
            ) : null}

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-card px-4 py-3 ring-1 ring-foreground/10">
              <span className="text-sm font-medium text-foreground">
                {extraLabel}
              </span>
              <Switch
                checked={extraEnabled}
                onCheckedChange={(checked) =>
                  setExtraEnabled(Boolean(checked))
                }
              />
            </label>
          </div>

          <div className="min-h-0 overflow-y-auto border-t bg-muted/20 p-5 sm:border-t-0 sm:border-l">
            <OrderPaymentPanel
              lines={orderLines}
              total={amountPaid}
              totalLabel={
                amountPaid > 0 ? "Amount due now" : "No additional payment"
              }
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              showPayment={amountPaid > 0}
              confirmLabel={
                amountPaid > 0
                  ? `Pay ${formatNpr(amountPaid)}`
                  : "Confirm changes"
              }
              confirmDisabled={!hasChanges}
              confirming={isLoading}
              onCancel={() => onOpenChange(false)}
              onConfirm={handleConfirm}
              footnote="Payment is simulated (demo) — confirm to apply your updated limits."
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
