"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const partyNavItems = [
  { label: "Supplier", href: "/purchase/suppliers" },
  { label: "Customer", href: "/sales/customers" },
] as const

export function PartyNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex gap-5 border-b"
      aria-label="Party management"
    >
      {partyNavItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "-mb-px border-b-2 px-0.5 pb-2.5 pt-1 text-sm transition-colors",
              isActive
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
