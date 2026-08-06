"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { adminBrand, adminNavigation } from "@/config/admin-navigation"
import Logo from "@/components/logo"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/navigation"

function isNavItemActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin"
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

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => {
              const ChildIcon = child.icon

              return (
                <SidebarMenuSubItem key={child.href}>
                  <SidebarMenuSubButton
                    render={<Link href={child.href} />}
                    isActive={isNavItemActive(pathname, child.href)}
                  >
                    <ChildIcon />
                    <span>{child.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { state, isMobile, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  return (
    <Sidebar collapsible="icon" className="relative">
      {!isMobile ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                  "absolute top-1/2 z-30 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-sm transition-opacity",
                  "opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-foreground",
                  "-right-3"
                )}
              />
            }
          >
            {isCollapsed ? (
              <ChevronRight className="size-3.5" />
            ) : (
              <ChevronLeft className="size-3.5" />
            )}
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      ) : null}

      <SidebarHeader className="h-14 shrink-0 justify-center gap-0 border-b border-sidebar-border px-3 py-0">
        <div className="flex h-full items-center gap-2">
          <Link
            href="/admin"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg outline-hidden ring-sidebar-ring focus-visible:ring-2 group-data-[collapsible=icon]:justify-center"
          >
            <Logo width={28} height={28} />
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {adminBrand.name}
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-1 py-2">
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {adminNavigation.map((item) => (
                <NavMenuItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
