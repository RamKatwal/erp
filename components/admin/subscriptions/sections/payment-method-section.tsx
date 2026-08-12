"use client"

import { CreditCardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatPaymentMethodSummary } from "@/types/subscription"
import type { SubscriptionPaymentMethod } from "@/types/subscription"

type PaymentMethodSectionProps = {
  paymentMethod: SubscriptionPaymentMethod | null
  autoRenew: boolean
  onAutoRenewChange: (value: boolean) => void
}

export function PaymentMethodSection({
  paymentMethod,
  autoRenew,
  onAutoRenewChange,
}: PaymentMethodSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Payment method</h2>
            <p className="text-xs text-muted-foreground">
              Card on file used for recurring charges.
            </p>
          </div>
          <Button type="button" size="sm" variant="outline">
            Update payment method
          </Button>
        </div>

        {paymentMethod ? (
          <div className="mt-4 flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
            <div className="flex size-10 items-center justify-center rounded-md border bg-background">
              <CreditCardIcon className="size-4 text-muted-foreground" />
            </div>
            <dl className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Card</dt>
                <dd className="font-medium">
                  {formatPaymentMethodSummary(paymentMethod)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Expiry</dt>
                <dd className="font-medium tabular-nums">
                  {String(paymentMethod.expiryMonth).padStart(2, "0")}/
                  {paymentMethod.expiryYear}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Billing email</dt>
                <dd className="font-medium">{paymentMethod.billingEmail}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No payment method on file.
          </p>
        )}
      </section>

      <section className="rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Auto-renewal</h2>
            <p className="text-xs text-muted-foreground">
              Automatically renew this subscription at the end of each period.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {autoRenew ? "Enabled" : "Disabled"}
            </span>
            <Switch
              checked={autoRenew}
              onCheckedChange={onAutoRenewChange}
              aria-label="Toggle auto-renewal"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
