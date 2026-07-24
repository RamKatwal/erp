"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { settingsNavigation } from "@/config/settings-navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function flattenSettingsLinks() {
  return settingsNavigation.flatMap((section) => {
    if (section.children?.length) {
      return section.children.map((child) => ({
        label: `${section.title} / ${child.title}`,
        href: child.href,
      }))
    }

    return [{ label: section.title, href: section.href }]
  })
}

export function SettingsNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex flex-col gap-1 p-3", className)}
      aria-label="Settings"
    >
      {settingsNavigation.map((section) => {
        const hasChildren = Boolean(section.children?.length)

        if (!hasChildren) {
          const active = pathname === section.href

          return (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {section.title}
            </Link>
          )
        }

        return (
          <SettingsNavSection
            key={section.href}
            title={section.title}
            href={section.href}
            items={section.children!}
            pathname={pathname}
          />
        )
      })}
    </nav>
  )
}

export function SettingsMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const links = React.useMemo(() => flattenSettingsLinks(), [])

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        Settings section
      </span>
      <select
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        value={pathname}
        onChange={(event) => {
          router.push(event.target.value)
        }}
      >
        {links.map((link) => (
          <option key={link.href} value={link.href}>
            {link.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SettingsNavSection({
  title,
  href,
  items,
  pathname,
}: {
  title: string
  href: string
  items: { title: string; href: string }[]
  pathname: string
}) {
  const isGroupActive = isActivePath(pathname, href)
  const [open, setOpen] = React.useState(isGroupActive)

  React.useEffect(() => {
    if (isGroupActive) {
      setOpen(true)
    }
  }, [isGroupActive])

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-foreground">
        <span>{title}</span>
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-0.5 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
        {items.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
}
