import { AppBrand } from "@/components/app-brand"

/** @deprecated Prefer `AppBrand` — kept for older imports. */
export default function ProvidhyLogo({
  className,
  href = "/signup",
}: {
  className?: string
  href?: string
}) {
  return <AppBrand href={href} className={className} size={32} priority />
}
