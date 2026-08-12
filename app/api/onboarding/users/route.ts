import { NextResponse } from "next/server"

import {
  patchOnboardingSession,
  readOnboardingSession,
} from "@/lib/onboarding/server-session"
import type { OnboardingUsersDraft } from "@/lib/onboarding/session-types"

function isUsersDraft(value: unknown): value is OnboardingUsersDraft {
  if (!value || typeof value !== "object") return false
  const v = value as Partial<OnboardingUsersDraft>
  return Boolean(v.ownerName?.trim() && v.ownerEmail?.trim())
}

/**
 * Finalize onboarding with owner + optional invites.
 * Idempotent when already complete with same provision token.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    users?: OnboardingUsersDraft
    skipInvites?: boolean
  } | null

  const existing = await readOnboardingSession()
  if (!existing) {
    return NextResponse.json({ error: "No onboarding session." }, { status: 401 })
  }

  if (existing.status === "complete") {
    return NextResponse.json({
      session: existing,
      alreadyComplete: true,
    })
  }

  if (existing.status !== "users_pending" && existing.status !== "branches_pending") {
    return NextResponse.json(
      { error: "Finish company and branches before adding users." },
      { status: 403 }
    )
  }

  if (!isUsersDraft(body?.users)) {
    return NextResponse.json(
      { error: "Owner name and email are required." },
      { status: 400 }
    )
  }

  const users: OnboardingUsersDraft = {
    ownerName: body.users.ownerName.trim(),
    ownerEmail: body.users.ownerEmail.trim().toLowerCase(),
    ownerPhone: body.users.ownerPhone?.trim() || undefined,
    invites: body.skipInvites
      ? []
      : (body.users.invites ?? []).filter(
          (invite) => invite.email.trim() && invite.name.trim()
        ),
  }

  const session = await patchOnboardingSession({
    users,
    status: "complete",
    provisionToken:
      existing.provisionToken ??
      `prov_${existing.companyId ?? "org"}_${Date.now().toString(36)}`,
  })

  return NextResponse.json({ session, alreadyComplete: false })
}

export async function GET() {
  const session = await readOnboardingSession()
  return NextResponse.json({ users: session?.users ?? null })
}
