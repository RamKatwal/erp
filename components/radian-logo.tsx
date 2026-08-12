import Image from "next/image"

import { appBrand } from "@/config/navigation"

/** Icon-only Omniverse mark (alias of the shared brand glyph). */
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
