import { NextResponse } from "next/server"

import {
  patchOnboardingSession,
  readOnboardingSession,
} from "@/lib/onboarding/server-session"

type BranchPayload = {
  id: string
  name: string
  code: string
  address: string
  contactNumber?: string
  contactEmail?: string
}

/**
 * Save branches during setup — completes onboarding.
 * Idempotent via provisionToken for branch save retries.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    branches?: BranchPayload[]
    provisionToken?: string
  } | null

  const existing = await readOnboardingSession()
  if (!existing) {
    return NextResponse.json({ error: "No onboarding session." }, { status: 401 })
  }

  if (existing.status === "users_pending" || existing.status === "complete") {
    return NextResponse.json({
      session: existing,
      alreadyProvisioned: true,
    })
  }

  if (
    existing.status !== "branches_pending" &&
    existing.status !== "company_pending"
  ) {
    return NextResponse.json(
      { error: "Company must be created before branches." },
      { status: 403 }
    )
  }

  if (!existing.company || !existing.companyId) {
    return NextResponse.json(
      { error: "Company record missing." },
      { status: 400 }
    )
  }

  if (!body?.branches?.length) {
    return NextResponse.json(
      { error: "At least one branch is required." },
      { status: 400 }
    )
  }

  const token =
    body.provisionToken ??
    existing.provisionToken ??
    `prov_${existing.companyId}_${Date.now().toString(36)}`

  const session = await patchOnboardingSession({
    status: "complete",
    provisionToken: token,
  })

  return NextResponse.json({
    session,
    alreadyProvisioned: false,
    companyId: session.companyId,
    branches: body.branches,
  })
}
