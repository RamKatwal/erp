"use client"

import * as React from "react"
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
import { cn } from "@/lib/utils"

export function AppNavbar() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

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

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="relative group"
                aria-label="Notifications"
              />
            }
          >
            <BellIcon />
            <Badge className="absolute -top-1.5 -right-1.5 size-4 justify-center rounded-full border-2 border-background p-0 text-[10px]">
              3
            </Badge>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded-md bg-black px-2 py-1 text-[11px] text-white group-hover:block">
              Notifications
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                <span className="font-medium">Low stock alert</span>
                <span className="text-xs text-muted-foreground">
                  Widget A is below reorder level
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                <span className="font-medium">New purchase order</span>
                <span className="text-xs text-muted-foreground">
                  PO-1042 awaiting approval
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                <span className="font-medium">Invoice overdue</span>
                <span className="text-xs text-muted-foreground">
                  INV-2091 is 5 days past due
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
              <AvatarFallback className="text-xs">NB</AvatarFallback>
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
                    <AvatarFallback>NB</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">
                      Nick Bold
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      nick@reui.io
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
              <DropdownMenuItem>
                <Settings />
                Settings
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
              <DropdownMenuItem>
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
