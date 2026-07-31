"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  BellIcon,
  Bot,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"

import { AppBreadcrumb } from "@/components/layout/app-breadcrumb"
import { CommandSearch } from "@/components/layout/command-search"
import { CreateDialog } from "@/components/layout/create-dialog"
import { NotificationsPanel } from "@/components/layout/notifications-panel"
import { useSettingsModal } from "@/components/settings/settings-modal-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser, isMainAdmin } from "@/lib/auth/current-user"
import { sampleNotifications } from "@/lib/mock/notifications"
import { cn } from "@/lib/utils"

export function AppNavbar() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const { openSettings } = useSettingsModal()
  const currentUser = getCurrentUser()
  const unreadCount = sampleNotifications.filter((item) => !item.read).length

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-white px-4 dark:bg-background">
      <div className="flex h-14 min-w-0 flex-1 items-center">
        <AppBreadcrumb />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <CreateDialog />

        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

        <CommandSearch />

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative group"
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
          onClick={() => setNotificationsOpen(true)}
        >
          <BellIcon />
          {unreadCount > 0 ? (
            <Badge className="absolute -top-1.5 -right-1.5 size-4 justify-center rounded-full border-2 border-background p-0 text-[10px]">
              {unreadCount}
            </Badge>
          ) : null}
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded-md bg-black px-2 py-1 text-[11px] text-white group-hover:block">
            Notifications
          </span>
        </Button>
        <NotificationsPanel
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/30 relative group"
                aria-label="User menu"
              />
            }
          >
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded-md bg-black px-2 py-1 text-[11px] text-white group-hover:block">
              Profile
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal text-foreground">
                <div className="flex items-center gap-2 px-1.5 py-1.5">
                  <Avatar size="sm">
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold">
                        {currentUser.name}
                      </span>
                      {isMainAdmin(currentUser) ? (
                        <Badge variant="secondary">Admin</Badge>
                      ) : null}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openSettings("profile")}>
                <User />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bot />
                My Agents
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity />
                Usage
              </DropdownMenuItem>
              <DropdownMenuItem>
                <KeyRound />
                API Keys
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openSettings("notifications")}>
                <Settings />
                Settings
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div
                className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-sm"
                onPointerDown={(event) => event.preventDefault()}
              >
                <span className="flex items-center gap-1.5">
                  <Palette className="size-4 shrink-0" />
                  Theme
                </span>
                <div className="flex items-center rounded-full border bg-muted/60 p-0.5">
                  {(
                    [
                      { value: "light", icon: Sun, label: "Light" },
                      { value: "dark", icon: Moon, label: "Dark" },
                      { value: "system", icon: Monitor, label: "System" },
                    ] as const
                  ).map(({ value, icon: Icon, label }) => {
                    const active = mounted && theme === value
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-label={label}
                        disabled={!mounted}
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors",
                          "hover:text-foreground disabled:opacity-50",
                          active &&
                            "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                        )}
                        onClick={() => setTheme(value)}
                      >
                        <Icon className="size-3.5" />
                      </button>
                    )
                  })}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/signup")}>
                <LogOut />
                Sign Out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
