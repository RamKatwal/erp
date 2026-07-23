"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalculatorIcon,
  CalendarIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

const demoPages = [
  { title: "Home", href: "/", icon: LayoutDashboardIcon, shortcut: "⌘H" },
  { title: "Products", href: "/inventory/products", icon: PackageIcon },
  { title: "Purchase Orders", href: "/purchase/order", icon: ShoppingCartIcon },
  { title: "Sales Orders", href: "/sales/order", icon: FileTextIcon },
  { title: "Settings", href: "/settings", icon: SettingsIcon, shortcut: "⌘S" },
] as const

const demoActions = [
  { title: "Create product", icon: PackageIcon },
  { title: "New purchase order", icon: ShoppingCartIcon },
  { title: "View calendar", icon: CalendarIcon },
  { title: "Open calculator", icon: CalculatorIcon },
  { title: "Find customer", icon: UsersIcon },
] as const

function useIsMac() {
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform))
  }, [])

  return isMac
}

export function CommandSearch({ className }: { className?: string }) {
  const router = useRouter()
  const isMac = useIsMac()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function runCommand(command: () => void) {
    setOpen(false)
    command()
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label="Search"
        className="sm:hidden"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden h-8 w-44 items-center gap-2 rounded-md border border-input bg-input/20 px-2 text-xs text-muted-foreground transition-colors outline-none sm:inline-flex",
          "hover:bg-input/40 hover:text-foreground",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          "dark:bg-input/30",
          className
        )}
        aria-label="Search"
      >
        <SearchIcon className="size-3.5 shrink-0 opacity-50" />
        <span className="flex-1 truncate text-left">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
          {isMac ? "⌘" : "Ctrl"}
          <span className="text-[10px]">K</span>
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-lg"
      >
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {demoPages.map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.title}
                  onSelect={() => runCommand(() => router.push(page.href))}
                >
                  <page.icon />
                  <span>{page.title}</span>
                  {"shortcut" in page && page.shortcut ? (
                    <CommandShortcut>{page.shortcut}</CommandShortcut>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick actions">
              {demoActions.map((action) => (
                <CommandItem
                  key={action.title}
                  value={action.title}
                  onSelect={() => runCommand(() => undefined)}
                >
                  <action.icon />
                  <span>{action.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
