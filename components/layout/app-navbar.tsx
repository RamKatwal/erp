"use client"

import * as React from "react"
import {
  Activity,
  BellIcon,
  Bot,
  Check,
  ChevronsUpDown,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Plus,
  SearchIcon,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"

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

const organizations = [
  {
    id: "acme",
    name: "Acme Inc",
    plan: "Pro",
    initials: "AC",
    color: "bg-violet-600 text-white",
  },
  {
    id: "novaco",
    name: "NovaCo",
    plan: "Free",
    initials: "NO",
    color: "bg-sky-600 text-white",
  },
] as const

export function AppNavbar() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [activeOrgId, setActiveOrgId] = React.useState("acme")
  const activeOrg =
    organizations.find((org) => org.id === activeOrgId) ?? organizations[0]

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-white px-4 dark:bg-background">
      <div className="flex h-14 min-w-0 items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 max-w-[11rem] gap-1.5 px-1.5 sm:max-w-[14rem]"
                aria-label="Switch organization"
              />
            }
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold",
                activeOrg.color
              )}
            >
              {activeOrg.initials}
            </span>
            <span className="truncate text-sm font-medium">{activeOrg.name}</span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
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
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Button size="sm" className="h-8 gap-1 px-2.5">
          <Plus className="size-3.5" />
          Create
        </Button>

        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

        <Button variant="outline" size="icon" aria-label="Search">
          <SearchIcon />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="Notifications"
              />
            }
          >
            <BellIcon />
            <Badge className="absolute -top-1.5 -right-1.5 size-4 justify-center rounded-full border-2 border-background p-0 text-[10px]">
              3
            </Badge>
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
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="User menu"
              />
            }
          >
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">NB</AvatarFallback>
            </Avatar>
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
