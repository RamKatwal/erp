import { NextResponse, type NextRequest } from "next/server"

import { decodeCookieValue } from "@/lib/onboarding/cookie-codec"
import {
  AUTH_SESSION_COOKIE,
  ONBOARDING_SESSION_COOKIE,
  type AuthSessionData,
  type OnboardingSessionData,
} from "@/lib/onboarding/session-types"
import {
  canAccessSetupStep,
  isAppShellPath,
  isOnboardingComplete,
  isOnboardingPath,
  isPlanOrPaymentPath,
  isSetupPath,
  parseOnboardingStatus,
  resumePathForStatus,
  setupStepIndexFromPath,
} from "@/lib/onboarding/status"

function readSession(req: NextRequest): OnboardingSessionData | null {
  const raw = req.cookies.get(ONBOARDING_SESSION_COOKIE)?.value
  const parsed = decodeCookieValue<OnboardingSessionData>(raw)
  if (!parsed?.email || !parseOnboardingStatus(parsed.status)) return null
  return parsed
}

function readAuth(req: NextRequest): AuthSessionData | null {
  const raw = req.cookies.get(AUTH_SESSION_COOKIE)?.value
  const parsed = decodeCookieValue<AuthSessionData>(raw)
  if (!parsed?.email) return null
  return parsed
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/onboarding/payment") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next()
  }

  const session = readSession(req)
  const auth = readAuth(req)

  if (isOnboardingPath(pathname)) {
    if (!session) {
      if (pathname.includes("/plan")) return NextResponse.next()
      const url = req.nextUrl.clone()
      url.pathname = "/onboarding/plan"
      url.search = req.nextUrl.search
      return NextResponse.redirect(url)
    }

    // Completed (incl. legacy users_pending): leave plan/branches/users;
    // allow company for admin add-company
    if (isOnboardingComplete(session.status)) {
      if (
        pathname.includes("/plan") ||
        pathname.includes("/branches") ||
        pathname.includes("/users")
      ) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.next()
    }

    if (pathname.includes("/users")) {
      return NextResponse.redirect(
        new URL(resumePathForStatus(session.status, session.email), req.url)
      )
    }

    // Plan/payment is standalone — only before setup entitlement is done,
    // or while still on plan_active (rare back-nav). Prefer resume to setup
    // once company work has started.
    if (isPlanOrPaymentPath(pathname)) {
      if (
        session.status === "company_pending" ||
        session.status === "branches_pending" ||
        session.status === "users_pending"
      ) {
        return NextResponse.redirect(
          new URL(resumePathForStatus(session.status, session.email), req.url)
        )
      }
      return NextResponse.next()
    }

    if (isSetupPath(pathname)) {
      const stepIndex = setupStepIndexFromPath(pathname)
      if (!canAccessSetupStep(session.status, stepIndex)) {
        return NextResponse.redirect(
          new URL(resumePathForStatus(session.status, session.email), req.url)
        )
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  }

  if (isAppShellPath(pathname)) {
    if (!session) {
      if (auth) return NextResponse.next()
      return NextResponse.next()
    }

    if (!isOnboardingComplete(session.status)) {
      return NextResponse.redirect(
        new URL(resumePathForStatus(session.status, session.email), req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/admin/:path*",
    "/configurations/:path*",
    "/inventory/:path*",
    "/purchase/:path*",
    "/sales/:path*",
    "/accounting/:path*",
    "/settings/:path*",
  ],
}
