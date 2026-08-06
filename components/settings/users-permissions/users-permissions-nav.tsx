"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { usersPermissionsNavigation } from "@/config/users-permissions-navigation"
import { cn } from "@/lib/utils"

export function UsersPermissionsNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex flex-col gap-1 p-3", className)}
      aria-label="Users and permissions"
    >
      {usersPermissionsNavigation.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

export function UsersPermissionsMobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const value = React.useMemo(() => {
    const match = usersPermissionsNavigation.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    return match?.href ?? usersPermissionsNavigation[0]?.href
  }, [pathname])

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        Users & Permissions
      </span>
      <select
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        value={value}
        onChange={(event) => {
          router.push(event.target.value)
        }}
      >
        {usersPermissionsNavigation.map((item) => (
          <option key={item.href} value={item.href}>
            {item.title}
          </option>
        ))}
      </select>
    </label>
  )
}
