import Link from "next/link"

import { cn } from "@/lib/utils"

export default function ProvidhyLogo({
  className,
  href = "/signup",
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-2xl font-bold tracking-[0.08em] text-foreground uppercase",
        className
      )}
    >
      Providhy
    </Link>
  )
}
