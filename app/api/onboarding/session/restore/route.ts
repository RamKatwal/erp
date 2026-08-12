import { NextResponse } from "next/server"

import {
  readOnboardingSession,
  writeOnboardingSession,
} from "@/lib/onboarding/server-session"
import {
  createEmptyOnboardingSession,
  type OnboardingSessionData,
} from "@/lib/onboarding/session-types"
import { parseOnboardingStatus } from "@/lib/onboarding/status"

/**
 * Restore cookie session from durable client mirror (localStorage).
 * Used when the browser still has drafts but the httpOnly cookie was cleared.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    session?: OnboardingSessionData
  } | null

  const incoming = body?.session
  if (!incoming?.email || !parseOnboardingStatus(incoming.status)) {
    return NextResponse.json({ error: "Valid session required" }, { status: 400 })
  }

  const existing = await readOnboardingSession()

  // Prefer newer updatedAt; never downgrade complete → incomplete from stale client
  if (existing?.email === incoming.email.toLowerCase()) {
    if (
      existing.status === "complete" &&
      incoming.status !== "complete"
    ) {
      return NextResponse.json({ session: existing })
    }
    const existingTime = Date.parse(existing.updatedAt || "") || 0
    const incomingTime = Date.parse(incoming.updatedAt || "") || 0
    if (existingTime >= incomingTime) {
      return NextResponse.json({ session: existing })
    }
  }

  const session: OnboardingSessionData = {
    ...createEmptyOnboardingSession(incoming.email, incoming.status),
    ...incoming,
    email: incoming.email.trim().toLowerCase(),
    updatedAt: new Date().toISOString(),
  }

  await writeOnboardingSession(session)
  return NextResponse.json({ session })
}
