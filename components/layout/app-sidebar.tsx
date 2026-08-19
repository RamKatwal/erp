"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LayoutGrid,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Plus,
  RotateCcw,
} from "lucide-react"

import { AppBrand } from "@/components/app-brand"
import {
  SidebarSubmenuItem,
  SidebarSubmenuPanel,
} from "@/components/motion/sidebar-submenu"
import {
  mainNavigation,
} from "@/config/navigation"
import {
  organizations,
  type Organization,
} from "@/config/organizations"
import { useHomeView } from "@/components/dashboard/home/home-view-context"
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarTrialFooter } from "@/components/layout/sidebar-trial-footer"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMac } from "@/hooks/use-is-mac"
import { getNavShortcutKeys } from "@/lib/keyboard/shortcuts"
import { formatShortcutLabel } from "@/lib/keyboard/utils"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/navigation"

function isNavItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavShortcutTooltipLabel({
  title,
  shortcutKeys,
}: {
  title: string
  shortcutKeys?: string[] | null
}) {
  const isMac = useIsMac()

  return (
    <>
      <span>{title}</span>
      {shortcutKeys?.length ? (
        <kbd
          data-slot="kbd"
          className="pointer-events-none ml-1 inline-flex h-5 items-center rounded border border-background/20 bg-background/15 px-1.5 font-mono text-[10px] font-medium text-background"
        >
          {formatShortcutLabel(shortcutKeys, isMac)}
        </kbd>
      ) : null}
    </>
  )
}

function navTooltip(title: string, href: string) {
  const shortcutKeys = getNavShortcutKeys(href)

  return {
    children: (
      <NavShortcutTooltipLabel title={title} shortcutKeys={shortcutKeys} />
    ),
  }
}

function HomeMoreActions() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()
  const {
    isFullscreen,
    expandToFullscreen,
    exitFullscreen,
    layoutActions,
  } = useHomeView()

  const isHomePage = pathname === "/"
  const canEdit = Boolean(
    isHomePage && layoutActions?.canEdit && !layoutActions.isLayoutEditing
  )
  const showFullscreenAction = isHomePage || isFullscreen

  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger
          render={
            <TooltipTrigger
              render={<SidebarMenuAction showOnHover aria-label="More actions" />}
            />
          }
        >
          <MoreHorizontal />
          <span className="sr-only">More actions</span>
        </DropdownMenuTrigger>
        <TooltipContent side="right">More actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="start"
        className="w-52"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>More actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canEdit ? (
            <DropdownMenuItem onClick={() => layoutActions?.startEditing()}>
              <LayoutGrid />
              Edit layout
            </DropdownMenuItem>
          ) : null}
          {canEdit && layoutActions?.hasCustomLayout ? (
            <DropdownMenuItem onClick={() => layoutActions?.resetLayout()}>
              <RotateCcw />
              Reset layout
            </DropdownMenuItem>
          ) : null}
          {showFullscreenAction ? (
            isFullscreen ? (
              <DropdownMenuItem onClick={exitFullscreen}>
                <Minimize2 />
                Back to default
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={expandToFullscreen}>
                <Maximize2 />
                Expand to full screen
              </DropdownMenuItem>
            )
          ) : null}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavMenuItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const isActive = isNavItemActive(pathname, item.href)
  const hasChildren = Boolean(item.children?.length)
  const isGroupActive = hasChildren && isActive
  const [expanded, setExpanded] = React.useState(isGroupActive)
  const isHome = item.href === "/"

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
          tooltip={navTooltip(item.title, item.href)}
          isActive={isActive}
        >
          <Icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
        {isHome ? <HomeMoreActions /> : null}
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
              tooltip={navTooltip(item.title, item.href)}
              isActive={isGroupActive}
              className="w-full"
            />
          }
        >
          <Icon />
          <span>{item.title}</span>
          <ChevronRight className="ml-auto size-3.5! text-sidebar-foreground/40 transition-transform group-data-[open]/collapsible:rotate-90" />
        </CollapsibleTrigger>

        <SidebarSubmenuPanel open={expanded} panelKey={`${item.href}-submenu`}>
          {item.children?.map((child, index) => {
            const ChildIcon = child.icon
            const shortcutKeys = getNavShortcutKeys(child.href)

            const content = (
              <>
                <ChildIcon />
                <span>{child.title}</span>
              </>
            )

            return (
              <SidebarSubmenuItem key={child.href} index={index}>
                {shortcutKeys ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <SidebarMenuSubButton
                          render={<Link href={child.href} />}
                          isActive={isNavItemActive(pathname, child.href)}
                        />
                      }
                    >
                      {content}
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      <NavShortcutTooltipLabel
                        title={child.title}
                        shortcutKeys={shortcutKeys}
                      />
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <SidebarMenuSubButton
                    render={<Link href={child.href} />}
                    isActive={isNavItemActive(pathname, child.href)}
                  >
                    {content}
                  </SidebarMenuSubButton>
                )}
              </SidebarSubmenuItem>
            )
          })}
        </SidebarSubmenuPanel>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state, isMobile, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const [activeOrgId, setActiveOrgId] = React.useState<Organization["id"]>(
    organizations[0].id
  )
  const activeOrg =
    organizations.find((org) => org.id === activeOrgId) ?? organizations[0]

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
          <AppBrand
            href="/"
            className="flex-1 ring-sidebar-ring focus-visible:ring-2 group-data-[collapsible=icon]:justify-center"
            nameClassName="text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            imageClassName="h-7 w-7 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7"
            priority
          />
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

      <SidebarFooter className="border-t border-sidebar-border p-2 gap-2">
        <SidebarTrialFooter daysRemaining={3} />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={activeOrg.name}
                    className="h-12 cursor-pointer gap-2.5 rounded-lg px-2 data-popup-open:bg-sidebar-accent"
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
                    {activeOrg.plan}
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
