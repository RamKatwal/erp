import Image from "next/image"

import { appBrand } from "@/config/navigation"

/** Icon-only Omniverse mark (for places that need the glyph without the wordmark). */
export default function Logo({
  width = 32,
  height = 32,
  className,
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <Image
      src={appBrand.logo}
      alt={appBrand.name}
      width={width}
      height={height}
      className={className ?? "rounded-[22%] object-contain"}
      style={{ width, height }}
      priority
    />
  )
}
