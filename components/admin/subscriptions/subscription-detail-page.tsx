"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2Icon,
  ChevronDown,
  RefreshCwIcon,
  Settings2Icon,
  TriangleAlertIcon,
} from "lucide-react"

import { CancelSubscriptionDialog } from "@/components/admin/subscriptions/cancel-subscription-dialog"
import { RenewPlanDialog } from "@/components/admin/subscriptions/renew-plan-dialog"
import { CurrentPlanSection } from "@/components/admin/subscriptions/sections/current-plan-section"
import { InvoicesSection } from "@/components/admin/subscriptions/sections/invoices-section"
import { UpdatePlanLimitsDialog } from "@/components/admin/subscriptions/update-plan-limits-dialog"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatLongDate } from "@/lib/format"
import { getSubscriptionById } from "@/lib/mock/subscriptions"
import { invoiceReceiptPath } from "@/lib/mock/invoice-receipt"
import {
  subscriptionStatusLabels,
  type Subscription,
  type SubscriptionStatus,
} from "@/types/subscription"
import type { PaymentMethodId } from "@/lib/onboarding/plans"

function statusBadgeClassName(status: SubscriptionStatus) {
  switch (status) {
    case "active":
      return "border-transparent bg-success/15 text-success"
    case "trialing":
      return "border-transparent bg-secondary text-secondary-foreground"
    case "past_due":
      return "border-transparent bg-destructive/10 text-destructive"
    case "pending":
      return "border-border text-foreground"
    default:
      return "border-border text-muted-foreground"
  }
}

export function SubscriptionDetailPage({
  subscriptionId,
}: {
  subscriptionId: string
}) {
  const [subscription, setSubscription] = React.useState<
    Subscription | undefined
  >(() => getSubscriptionById(subscriptionId))
  const [renewOpen, setRenewOpen] = React.useState(false)
  const [cancelOpen, setCancelOpen] = React.useState(false)
  const [branchLimitsOpen, setBranchLimitsOpen] = React.useState(false)
  const [userLimitsOpen, setUserLimitsOpen] = React.useState(false)

  if (!subscription) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-xl font-semibold">Subscription not found</h1>
        <p className="text-sm text-muted-foreground">
          This subscription does not exist or has been removed.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/admin/subscriptions" />}
        >
          Back to subscriptions
        </Button>
      </div>
    )
  }

  function handleRenewConfirm() {
    setSubscription((prev) => {
      if (!prev) return prev
      const end = new Date(prev.periodEnd)
      if (prev.interval === "year") {
        end.setFullYear(end.getFullYear() + 1)
      } else {
        end.setMonth(end.getMonth() + 1)
      }
      const newEnd = end.toISOString().slice(0, 10)
      const remaining = Math.max(
        0,
        Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
      return {
        ...prev,
        periodEnd: newEnd,
        nextBillingDate: newEnd,
        remainingDays: remaining,
        status: "active",
      }
    })
  }

  function handleCancelConfirm() {
    setSubscription((prev) =>
      prev ? { ...prev, status: "canceled" } : prev
    )
  }

  function handleLimitsConfirm(
    branchesLimit: number,
    usersLimit: number,
    paymentMethod: PaymentMethodId,
    amountPaid: number
  ) {
    setSubscription((prev) => {
      if (!prev) return prev

      const today = new Date().toISOString().slice(0, 10)
      const invoiceId = `inv_${prev.id}_${Date.now()}`
      const pdfDownloadUrl = invoiceReceiptPath(invoiceId)
      const invoiceNumber = `INV-${prev.companyName
        .slice(0, 3)
        .toUpperCase()}-${Date.now().toString().slice(-6)}`

      return {
        ...prev,
        branchesLimit,
        usersLimit,
        paymentMethod: {
          provider: paymentMethod,
          billingEmail: prev.paymentMethod?.billingEmail ?? "",
        },
        invoices: [
          {
            invoiceId,
            invoiceNumber,
            issueDate: today,
            periodStart: today,
            periodEnd: prev.periodEnd,
            amountPaid,
            currency: prev.currency,
            status: "Paid",
            pdfDownloadUrl,
            planName: prev.planName,
            paymentMethod: {
              provider: paymentMethod,
              billingEmail: prev.paymentMethod?.billingEmail ?? "",
            },
            usersUsed: prev.usersUsed,
            usersLimit,
            branchesUsed: prev.branchesUsed,
            branchesLimit,
          },
          ...prev.invoices,
        ],
      }
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={`${subscription.planName} - ${subscription.companyName}`}
        badge={
          <Badge
            variant="outline"
            className={statusBadgeClassName(subscription.status)}
          >
            {subscriptionStatusLabels[subscription.status]}
          </Badge>
        }
        description={`Subscription ID: ${subscription.id} | Created: ${formatLongDate(subscription.createdAt)}`}
        breadcrumb={
          <Button
            variant="link"
            size="sm"
            className="mb-0.5 h-auto self-start px-0 text-muted-foreground"
            nativeButton={false}
            render={<Link href="/admin/subscriptions" />}
          >
            <ArrowLeft />
            Back to Subscriptions
          </Button>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={
                <Link
                  href={`/admin/companies/${subscription.companyId}/configuration`}
                />
              }
            >
              <Building2Icon className="size-4" />
              Company profile
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button size="sm" variant="outline" />}
            >
              <Settings2Icon className="mr-1 size-4" />
              Manage Plan
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-52">
              <DropdownMenuItem
                className="whitespace-nowrap"
                onClick={() => setRenewOpen(true)}
              >
                <RefreshCwIcon className="mr-2 size-4" />
                Renew plan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="whitespace-nowrap"
                variant="destructive"
                onClick={() => setCancelOpen(true)}
              >
                <TriangleAlertIcon className="mr-2 size-4" />
                Cancel subscription
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        }
      />

      <CurrentPlanSection
        subscription={subscription}
        onRenew={() => setRenewOpen(true)}
        onUpdateBranchLimits={() => setBranchLimitsOpen(true)}
        onUpdateUserLimits={() => setUserLimitsOpen(true)}
      />

      <InvoicesSection subscription={subscription} />

      <RenewPlanDialog
        open={renewOpen}
        onOpenChange={setRenewOpen}
        subscription={subscription}
        onConfirm={handleRenewConfirm}
      />

      <CancelSubscriptionDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        subscription={subscription}
        onConfirm={handleCancelConfirm}
      />

      <UpdatePlanLimitsDialog
        mode="branches"
        open={branchLimitsOpen}
        onOpenChange={setBranchLimitsOpen}
        subscription={subscription}
        onConfirm={handleLimitsConfirm}
      />

      <UpdatePlanLimitsDialog
        mode="users"
        open={userLimitsOpen}
        onOpenChange={setUserLimitsOpen}
        subscription={subscription}
        onConfirm={handleLimitsConfirm}
      />
    </div>
  )
}
