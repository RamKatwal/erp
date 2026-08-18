"use client"

import * as React from "react"

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
import { formatCurrency, formatLongDate } from "@/lib/format"
import {
  billingIntervalLabels,
  billingIntervalUnits,
  type Subscription,
} from "@/types/subscription"

type RenewPlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  onConfirm: () => void
}

function computeNewPeriodEnd(current: string, interval: "month" | "year") {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(current)
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(current)

  if (interval === "year") {
    date.setFullYear(date.getFullYear() + 1)
  } else {
    date.setMonth(date.getMonth() + 1)
  }
  return date
}

export function RenewPlanDialog({
  open,
  onOpenChange,
  subscription,
  onConfirm,
}: RenewPlanDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const newEnd = computeNewPeriodEnd(
    subscription.periodEnd,
    subscription.interval
  )
  const newEndFormatted = newEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  function handleConfirm() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onConfirm()
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Renew subscription</DialogTitle>
          <DialogDescription>
            Pay now to extend your{" "}
            <span className="font-medium text-foreground">
              {subscription.planName}
            </span>{" "}
            for the next billing period.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-4">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="font-medium">{subscription.planName}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Billing cycle</dt>
              <dd className="font-medium">
                {billingIntervalLabels[subscription.interval]}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Current period ends</dt>
              <dd className="font-medium">
                {formatLongDate(subscription.periodEnd)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">New period ends</dt>
              <dd className="font-medium text-primary">{newEndFormatted}</dd>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between gap-3">
                <dt className="font-medium">Amount due now</dt>
                <dd className="text-base font-semibold tabular-nums">
                  {formatCurrency(subscription.amount, subscription.currency)} /{" "}
                  {billingIntervalUnits[subscription.interval]}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? (
              <Spinner size={18} variant="default" />
            ) : (
              `Pay ${formatCurrency(subscription.amount, subscription.currency)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
