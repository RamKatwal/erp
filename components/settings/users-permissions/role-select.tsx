"use client"

import * as React from "react"
import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Group } from "@/types/group"

type RoleSelectProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  roles: Group[]
  disabled?: boolean
  placeholder?: string
  active?: boolean
  className?: string
  "aria-invalid"?: boolean
}

export function RoleSelect({
  value,
  onChange,
  onBlur,
  roles,
  disabled,
  placeholder = "Select role…",
  active = true,
  className,
  "aria-invalid": ariaInvalid,
}: RoleSelectProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!active) {
      setOpen(false)
    }
  }, [active])

  const selectedRole = roles.find((role) => role.id === value)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      onBlur?.()
    }
  }

  function selectRole(roleId: string) {
    onChange(roleId)
    setOpen(false)
    onBlur?.()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled || roles.length === 0}
            aria-invalid={ariaInvalid}
            aria-haspopup="listbox"
            className={cn(
              "h-9 w-full justify-between gap-2 px-3 font-normal",
              !selectedRole && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <span className="truncate">
          {selectedRole?.name ??
            (roles.length === 0 ? "No roles available" : placeholder)}
        </span>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[var(--anchor-width)] p-0"
      >
        <Command>
          <CommandInput placeholder="Search roles…" />
          <CommandList className="max-h-64">
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.id}
                  value={role.name}
                  data-checked={value === role.id ? "true" : undefined}
                  onSelect={() => selectRole(role.id)}
                >
                  <span className="truncate">{role.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
