"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Plus,
} from "lucide-react"

import {
  appBrand,
  mainNavigation,
} from "@/config/navigation"
import { organizations } from "@/config/organizations"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/navigation"

const submenuTransition = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1] as const,
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavMenuItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const isActive = isNavItemActive(pathname, item.href)
  const hasChildren = Boolean(item.children?.length)
  const isGroupActive = hasChildren && isActive
  const [expanded, setExpanded] = React.useState(isGroupActive)

  React.useEffect(() => {
    if (isGroupActive) {
      setExpanded(true)
    }
  }, [isGroupActive])

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href={item.href} />}
          tooltip={item.title}
          isActive={isActive}
        >
          <Icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isGroupActive}
              className="w-full"
            />
          }
        >
          <Icon />
          <span>{item.title}</span>
          <ChevronRight className="ml-auto size-3.5! text-sidebar-foreground/40 transition-transform group-data-[open]/collapsible:rotate-90" />
        </CollapsibleTrigger>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key={`${item.href}-submenu`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={submenuTransition}
              className="overflow-hidden"
            >
              <SidebarMenuSub>
                {item.children?.map((child, index) => {
                  const ChildIcon = child.icon

                  return (
                    <SidebarMenuSubItem key={child.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...submenuTransition,
                          delay: index * 0.03,
                        }}
                      >
                        <SidebarMenuSubButton
                          render={<Link href={child.href} />}
                          isActive={isNavItemActive(pathname, child.href)}
                        >
                          <ChildIcon />
                          <span>{child.title}</span>
                        </SidebarMenuSubButton>
                      </motion.div>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state, isMobile, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const [activeOrgId, setActiveOrgId] = React.useState("acme")
  const activeOrg =
    organizations.find((org) => org.id === activeOrgId) ?? organizations[0]

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.key !== "/") return

      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTypingSurface =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (target as any)?.isContentEditable

      if (isTypingSurface) return

      event.preventDefault()
      toggleSidebar()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleSidebar])

  return (
    <Sidebar collapsible="icon" className="relative">
      {!isMobile ? (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute top-1/2 z-30 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-sm transition-opacity",
            "opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-foreground",
            "-right-3"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </button>
      ) : null}

      <SidebarHeader className="h-14 shrink-0 justify-center gap-0 border-b border-sidebar-border px-3 py-0">
        <div className="flex h-full items-center gap-2">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg outline-hidden ring-sidebar-ring focus-visible:ring-2 group-data-[collapsible=icon]:justify-center"
          >
            <Image
              src="/abc-company-logo.png"
              alt={appBrand.name}
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-md object-contain group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
              priority
            />
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {appBrand.name}
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-1 py-2">
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNavigation.map((item) => (
                <NavMenuItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={activeOrg.name}
                    className="h-12 gap-2.5 rounded-lg px-2 data-popup-open:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-semibold",
                      activeOrg.color
                    )}
                  >
                    {activeOrg.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium text-sidebar-foreground">
                    {activeOrg.name}
                  </span>
                  <span className="truncate text-[11px] text-sidebar-foreground/50">
                    {activeOrg.plan} plan
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                className="w-64"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => setActiveOrgId(org.id)}
                      className="gap-2"
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                          org.color
                        )}
                      >
                        {org.initials}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">{org.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {org.plan}
                        </span>
                      </span>
                      {org.id === activeOrgId ? (
                        <Check className="size-4 shrink-0 text-foreground" />
                      ) : null}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Plus />
                    Create Organization
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
