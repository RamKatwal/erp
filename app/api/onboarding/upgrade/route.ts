import { NextResponse } from "next/server"

import {
  buildEntitlementFromPlan,
  upgradeEntitlementPlan,
} from "@/lib/onboarding/entitlement"
import { calculatePricing, type PlanId } from "@/lib/onboarding/plans"
import {
  patchOnboardingSession,
  readOnboardingSession,
} from "@/lib/onboarding/server-session"
import type { OnboardingPlanSelection } from "@/lib/onboarding/storage"

/**
 * Free → Paid upgrade after onboarding is complete.
 * Does not re-run company/branch setup.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    plan?: OnboardingPlanSelection
    paymentOutcome?: "success" | "failed"
  } | null

  const existing = await readOnboardingSession()
  if (!existing) {
    return NextResponse.json({ error: "No session." }, { status: 401 })
  }

  if (existing.status !== "complete") {
    return NextResponse.json(
      { error: "Finish onboarding before upgrading from billing." },
      { status: 403 }
    )
  }

  if (!body?.plan || body.plan.planId === "free_trial") {
    return NextResponse.json(
      { error: "Select a paid plan to upgrade." },
      { status: 400 }
    )
  }

  const pricing = calculatePricing({
    planId: body.plan.planId as PlanId,
    users: body.plan.users,
    period: body.plan.period,
    branchesEnabled: body.plan.branchesEnabled,
    branchCount: body.plan.branchCount,
    moduleIds: body.plan.moduleIds,
  })

  if (pricing.isFree) {
    return NextResponse.json({ error: "Choose a paid plan." }, { status: 400 })
  }

  if (body.paymentOutcome === "failed") {
    return NextResponse.json(
      { error: "Payment failed. Try again." },
      { status: 402 }
    )
  }

  const base =
    existing.entitlement ??
    buildEntitlementFromPlan(
      existing.plan ?? {
        ...body.plan,
        planId: "free_trial",
      }
    )

  const entitlement = upgradeEntitlementPlan(base, {
    planId: body.plan.planId,
    users: body.plan.users,
    period: body.plan.period,
    branchCount: body.plan.branchesEnabled ? body.plan.branchCount : 1,
    moduleIds: body.plan.moduleIds,
    paymentMethod: body.plan.paymentMethod,
  })

  const session = await patchOnboardingSession({
    plan: body.plan,
    entitlement,
    status: "complete",
  })

  return NextResponse.json({ session, entitlement })
}
