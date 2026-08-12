import { cookies } from "next/headers"

import {
  AUTH_SESSION_COOKIE,
  ONBOARDING_SESSION_COOKIE,
  createEmptyOnboardingSession,
  decodeCookiePayload,
  encodeCookiePayload,
  type AuthSessionData,
  type OnboardingSessionData,
} from "@/lib/onboarding/session-types"
import { parseOnboardingStatus } from "@/lib/onboarding/status"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function readOnboardingSession(): Promise<OnboardingSessionData | null> {
  const jar = await cookies()
  const raw = jar.get(ONBOARDING_SESSION_COOKIE)?.value
  const parsed = decodeCookiePayload<OnboardingSessionData>(raw)
  if (!parsed?.email || !parseOnboardingStatus(parsed.status)) return null
  return parsed
}

export async function writeOnboardingSession(
  session: OnboardingSessionData
): Promise<void> {
  const jar = await cookies()
  const next: OnboardingSessionData = {
    ...session,
    email: session.email.trim().toLowerCase(),
    updatedAt: new Date().toISOString(),
  }
  jar.set(ONBOARDING_SESSION_COOKIE, encodeCookiePayload(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  })
}

export async function patchOnboardingSession(
  patch: Partial<OnboardingSessionData> & { email?: string }
): Promise<OnboardingSessionData> {
  const existing = await readOnboardingSession()
  const email = (patch.email ?? existing?.email ?? "").trim().toLowerCase()
  if (!email) {
    throw new Error("Onboarding session requires an email")
  }
  const base = existing ?? createEmptyOnboardingSession(email)
  const next: OnboardingSessionData = {
    ...base,
    ...patch,
    email,
    updatedAt: new Date().toISOString(),
  }
  await writeOnboardingSession(next)
  return next
}

export async function readAuthSession(): Promise<AuthSessionData | null> {
  const jar = await cookies()
  const raw = jar.get(AUTH_SESSION_COOKIE)?.value
  const parsed = decodeCookiePayload<AuthSessionData>(raw)
  if (!parsed?.email) return null
  return parsed
}

export async function writeAuthSession(auth: AuthSessionData): Promise<void> {
  const jar = await cookies()
  jar.set(AUTH_SESSION_COOKIE, encodeCookiePayload(auth), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  })
}

export async function clearAuthAndOnboarding(): Promise<void> {
  const jar = await cookies()
  jar.delete(AUTH_SESSION_COOKIE)
  jar.delete(ONBOARDING_SESSION_COOKIE)
}
