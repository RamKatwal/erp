"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  companyInitials,
  getFaviconUrl,
} from "@/lib/brand/favicon"
import { cn } from "@/lib/utils"

type CompanyLogoBaseProps = {
  name: string
  domain?: string | null
  className?: string
}

type CompanyAvatarProps = CompanyLogoBaseProps & {
  size?: "sm" | "default" | "lg"
  showTooltip?: boolean
  avatarClassName?: string
  fallbackClassName?: string
}

/** Circular avatar with Google favicon + initials fallback. */
export function CompanyAvatar({
  name,
  domain,
  size = "sm",
  showTooltip = true,
  className,
  avatarClassName,
  fallbackClassName,
}: CompanyAvatarProps) {
  const avatar = (
    <Avatar
      size={size}
      className={cn("after:border-border/60", avatarClassName, className)}
      aria-label={name}
    >
      {domain ? (
        <AvatarImage src={getFaviconUrl(domain, 128)} alt="" />
      ) : null}
      <AvatarFallback
        className={cn(
          "bg-muted text-[10px] font-semibold text-foreground",
          fallbackClassName
        )}
      >
        {companyInitials(name)}
      </AvatarFallback>
    </Avatar>
  )

  if (!showTooltip) return avatar

  return (
    <Tooltip>
      <TooltipTrigger render={avatar} />
      <TooltipContent side="top">{name}</TooltipContent>
    </Tooltip>
  )
}

type CompanyLogoProps = CompanyLogoBaseProps & {
  size?: number
}

/** Square logo image via Google favicon service (for sidebars, lists, etc.). */
export function CompanyLogo({
  name,
  domain,
  size = 16,
  className,
}: CompanyLogoProps) {
  if (!domain) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[4px] bg-muted text-[10px] font-semibold text-foreground",
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {companyInitials(name)}
      </span>
    )
  }

  return (
    <img
      src={getFaviconUrl(domain, 128)}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={cn(
        "shrink-0 rounded-[4px] object-contain",
        className
      )}
      style={{ width: size, height: size }}
    />
  )
}
