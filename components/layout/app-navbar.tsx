"use client"

import { Bell, LogOut, Search, Settings, User } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="mx-auto w-full max-w-xl px-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules, records, actions..."
            className="h-9 w-full bg-muted/40 pl-9"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative"
                aria-label="Notifications"
              />
            }
          >
            <Bell className="size-4" />
            <Badge className="absolute -top-1 -right-1 size-4 justify-center rounded-full p-0 text-[10px]">
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

        <Separator orientation="vertical" className="h-5" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label="User menu"
              />
            }
          >
            <Avatar size="sm">
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span>Admin User</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    admin@ibmerp.com
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
