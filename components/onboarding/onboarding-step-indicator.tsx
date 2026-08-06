"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

const STEPS = [
  { id: "plan", label: "Plan", href: "/onboarding/plan" },
  { id: "company", label: "Company", href: "/onboarding/company" },
  { id: "branches", label: "Branches", href: "/onboarding/branches" },
] as const

function stepIndexFromPath(pathname: string) {
  if (pathname.includes("/branches")) return 2
  if (pathname.includes("/company")) return 1
  return 0
}

export function OnboardingStepIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")?.trim()
  const emailQuery = email ? `?email=${encodeURIComponent(email)}` : ""

  const activeIndex = stepIndexFromPath(pathname)

  return (
    <nav aria-label="Onboarding steps" className="flex items-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = index === activeIndex
        const isComplete = index < activeIndex
        // Company is required — only allow going back to completed steps.
        // Branches can be reached from company once company is done (complete).
        const canLink = isComplete

        const content = (
          <>
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                isActive && "bg-primary text-primary-foreground",
                isComplete && "bg-primary/15 text-primary",
                !isActive && !isComplete && "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </>
        )

        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 ? (
              <span
                className="mx-1 h-px w-4 bg-border sm:w-8"
                aria-hidden
              />
            ) : null}
            {canLink ? (
              <Link
                href={`${step.href}${emailQuery}`}
                className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                {content}
              </Link>
            ) : (
              <div className="flex items-center gap-2">{content}</div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
