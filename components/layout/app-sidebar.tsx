"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronRight, PanelLeft } from "lucide-react"

import {
  appBrand,
  mainNavigation,
  secondaryNavigation,
} from "@/config/navigation"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 shrink-0 justify-center gap-0 border-b border-sidebar-border px-3 py-0">
        <div className="flex h-full items-center gap-2">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg outline-hidden ring-sidebar-ring focus-visible:ring-2 group-data-[collapsible=icon]:justify-center"
          >
            <Image
              src="/acme-logo.svg"
              alt={appBrand.name}
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-md"
              priority
            />
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {appBrand.name}
            </span>
          </Link>
          {!isCollapsed ? (
            <SidebarTrigger className="size-8 shrink-0 group-data-[collapsible=icon]:hidden" />
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-1 py-2">
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {isCollapsed ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={toggleSidebar}
                    tooltip="Expand sidebar"
                    className="group-data-[collapsible=icon]:size-8!"
                  >
                    <PanelLeft />
                    <span>Expand sidebar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
              {mainNavigation.map((item) => (
                <NavMenuItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto py-1">
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      tooltip={item.title}
                      isActive={isNavItemActive(pathname, item.href)}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/settings" />}
              tooltip="Admin User"
              className="h-12 gap-2.5 rounded-lg px-2"
            >
              <Avatar size="sm" className="size-8">
                <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  Admin User
                </span>
                <span className="truncate text-[11px] text-sidebar-foreground/50">
                  admin@ibmerp.com
                </span>
              </div>
              <ChevronDown className="ml-auto size-3.5 shrink-0 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
