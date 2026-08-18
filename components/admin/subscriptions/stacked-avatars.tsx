"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type {
  SubscriptionAssignedBranch,
  SubscriptionMember,
} from "@/types/subscription"

const MAX_VISIBLE_AVATARS = 3

const branchAvatarColors = [
  "bg-sky-500 text-white",
  "bg-violet-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-rose-500 text-white",
  "bg-indigo-500 text-white",
] as const

function branchInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}

export function StackedAvatars({
  items,
  total,
  emptyLabel = "—",
}: {
  items: { key: string; initials: string; color: string; title: string }[]
  total: number
  emptyLabel?: string
}) {
  if (total <= 0 && items.length === 0) {
    return <span className="text-muted-foreground">{emptyLabel}</span>
  }

  const visible = items.slice(0, MAX_VISIBLE_AVATARS)
  const remaining = Math.max(total, items.length) - visible.length
  const remainingNames = items
    .slice(MAX_VISIBLE_AVATARS)
    .map((item) => item.title)
  const remainingLabel =
    remainingNames.length > 0 ? remainingNames.join(", ") : `${remaining} more`

  return (
    <div className="flex items-center gap-2">
      <AvatarGroup>
        {visible.map((item) => (
          <Tooltip key={item.key}>
            <TooltipTrigger
              render={
                <Avatar
                  size="sm"
                  className="cursor-default"
                  aria-label={item.title}
                />
              }
            >
              <AvatarFallback
                className={cn("text-[10px] font-medium", item.color)}
              >
                {item.initials}
              </AvatarFallback>
            </TooltipTrigger>
            <TooltipContent side="top">{item.title}</TooltipContent>
          </Tooltip>
        ))}
        {remaining > 0 ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <AvatarGroupCount
                  className="size-6 cursor-default text-[10px] font-medium"
                  aria-label={remainingLabel}
                />
              }
            >
              +{remaining}
            </TooltipTrigger>
            <TooltipContent side="top">{remainingLabel}</TooltipContent>
          </Tooltip>
        ) : null}
      </AvatarGroup>
    </div>
  )
}

export function userAvatarItems(
  members: SubscriptionMember[],
  usersUsed: number
) {
  const fromMembers = members.map((member) => ({
    key: member.id,
    initials: member.initials,
    color: member.color,
    title: member.name,
  }))

  if (fromMembers.length > 0) return fromMembers

  return Array.from(
    { length: Math.min(usersUsed, MAX_VISIBLE_AVATARS) },
    (_, index) => ({
      key: `user-${index}`,
      initials: `U${index + 1}`,
      color: branchAvatarColors[index % branchAvatarColors.length],
      title: `User ${index + 1}`,
    })
  )
}

export function branchAvatarItems(branches: SubscriptionAssignedBranch[]) {
  return branches.map((branch, index) => ({
    key: branch.branchId,
    initials: branchInitials(branch.branchName),
    color: branchAvatarColors[index % branchAvatarColors.length],
    title: branch.branchName,
  }))
}
