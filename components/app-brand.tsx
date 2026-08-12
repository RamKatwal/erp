import Image from "next/image"
import Link from "next/link"

import { appBrand } from "@/config/navigation"
import { cn } from "@/lib/utils"

type AppBrandProps = {
  href?: string
  className?: string
  nameClassName?: string
  imageClassName?: string
  size?: number
  priority?: boolean
  showName?: boolean
}

/** Shared company mark (logo + name) used across auth, sidebar, and onboarding. */
export function AppBrand({
  href = "/",
  className,
  nameClassName,
  imageClassName,
  size = 28,
  priority = false,
  showName = true,
}: AppBrandProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-0 items-center gap-2.5 rounded-lg outline-hidden",
        className
      )}
    >
      <Image
        src={appBrand.logo}
        alt={appBrand.name}
        width={size}
        height={size}
        className={cn(
          "shrink-0 rounded-[22%] object-contain",
          imageClassName
        )}
        style={{ width: size, height: size }}
        priority={priority}
      />
      {showName ? (
        <span
          className={cn(
            "truncate text-sm font-semibold tracking-tight",
            nameClassName
          )}
        >
          {appBrand.name}
        </span>
      ) : null}
    </Link>
  )
}
