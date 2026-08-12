"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
} from "lucide-react"

import { BranchAllocationsSection } from "@/components/admin/subscriptions/sections/branch-allocations-section"
import { InvoicesSection } from "@/components/admin/subscriptions/sections/invoices-section"
import { OverviewSection } from "@/components/admin/subscriptions/sections/overview-section"
import { PaymentMethodSection } from "@/components/admin/subscriptions/sections/payment-method-section"
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
import { getSubscriptionById } from "@/lib/mock/subscriptions"
import { cn } from "@/lib/utils"
import {
  subscriptionStatusLabels,
  type SubscriptionStatus,
} from "@/types/subscription"

type DetailSection =
  | "overview"
  | "branches"
  | "invoices"
  | "payment"

function statusBadgeVariant(
  status: SubscriptionStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default"
    case "trialing":
      return "secondary"
    case "past_due":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "outline"
  }
}

export function SubscriptionDetailPage({
  subscriptionId,
}: {
  subscriptionId: string
}) {
  const subscription = getSubscriptionById(subscriptionId)
  const [activeSection, setActiveSection] =
    React.useState<DetailSection>("overview")
  const [autoRenew, setAutoRenew] = React.useState(
    subscription?.autoRenew ?? false
  )

  React.useEffect(() => {
    setAutoRenew(subscription?.autoRenew ?? false)
  }, [subscription?.autoRenew, subscriptionId])

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

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={`${subscription.planName} - ${subscription.companyName}`}
        badge={
          <Badge variant={statusBadgeVariant(subscription.status)}>
            {subscriptionStatusLabels[subscription.status]}
          </Badge>
        }
        description={`Subscription ID: ${subscription.id} | Created: ${subscription.createdAt}`}
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
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button size="sm" variant="outline" />}
            >
              Manage Plan
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Change plan</DropdownMenuItem>
              <DropdownMenuItem>Renew now</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Cancel subscription
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="flex w-fit flex-wrap rounded-lg bg-muted p-1">
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            activeSection === "overview"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveSection("overview")}
        >
          <LayoutDashboard className="size-4" />
          Overview
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            activeSection === "branches"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveSection("branches")}
        >
          <Building2 className="size-4" />
          Branch Allocations
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            activeSection === "invoices"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveSection("invoices")}
        >
          <FileText className="size-4" />
          Invoices & History
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            activeSection === "payment"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveSection("payment")}
        >
          <CreditCard className="size-4" />
          Payment Method
        </button>
      </div>

      {activeSection === "overview" ? (
        <OverviewSection
          subscription={subscription}
          autoRenew={autoRenew}
          onAutoRenewChange={setAutoRenew}
          onShowInvoices={() => setActiveSection("invoices")}
        />
      ) : null}

      {activeSection === "branches" ? (
        <BranchAllocationsSection
          branches={subscription.assignedBranches}
          used={subscription.branchesUsed}
          limit={subscription.branchesLimit}
        />
      ) : null}

      {activeSection === "invoices" ? (
        <InvoicesSection invoices={subscription.invoices} />
      ) : null}

      {activeSection === "payment" ? (
        <PaymentMethodSection
          paymentMethod={subscription.paymentMethod}
          autoRenew={autoRenew}
          onAutoRenewChange={setAutoRenew}
        />
      ) : null}
    </div>
  )
}
