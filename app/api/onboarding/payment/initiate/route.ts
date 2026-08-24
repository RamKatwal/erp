import { NextResponse } from "next/server"

import { calculatePricing } from "@/lib/onboarding/plans"
import {
  patchOnboardingSession,
  readOnboardingSession,
} from "@/lib/onboarding/server-session"
import type { OnboardingPaymentIntent } from "@/lib/onboarding/session-types"

/** Start paid checkout — sets payment_pending and returns mock gateway URL. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    returnBase?: string
  } | null

  const existing = await readOnboardingSession()
  if (!existing?.plan) {
    return NextResponse.json(
      { error: "Select a plan before payment." },
      { status: 400 }
    )
  }

  if (
    (existing.status === "plan_active" || existing.status === "complete") &&
    existing.entitlement
  ) {
    // Idempotent: already paid / activated
    return NextResponse.json({
      session: existing,
      alreadyActive: true,
      checkoutUrl: null,
    })
  }

  const plan = existing.plan
  const pricing = calculatePricing({
    planId: plan.planId,
    users: plan.users,
    period: plan.period,
    branchesEnabled: plan.branchesEnabled,
    branchCount: plan.branchCount,
    moduleIds: plan.moduleIds,
  })

  if (pricing.isFree) {
    return NextResponse.json(
      { error: "Free plans do not require payment." },
      { status: 400 }
    )
  }

  if (!plan.paymentMethod) {
    return NextResponse.json(
      { error: "Select eSewa or Fonepay to continue." },
      { status: 400 }
    )
  }

  // Reuse pending intent id if still open (idempotent initiate)
  const intentId =
    existing.payment?.status === "pending"
      ? existing.payment.id
      : `pay_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

  const payment: OnboardingPaymentIntent = {
    id: intentId,
    amount: pricing.total,
    currency: "NPR",
    method: plan.paymentMethod,
    planId: plan.planId,
    createdAt: existing.payment?.createdAt ?? new Date().toISOString(),
    status: "pending",
  }

  const session = await patchOnboardingSession({
    payment,
    paymentSubStatus: "checkout",
    status: "payment_pending",
  })

  const base = body?.returnBase?.replace(/\/$/, "") || ""
  const checkoutUrl = `${base}/onboarding/payment/checkout?intent=${encodeURIComponent(intentId)}`

  return NextResponse.json({ session, checkoutUrl, alreadyActive: false })
}
