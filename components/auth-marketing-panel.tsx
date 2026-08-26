import { AppBrand } from "@/components/app-brand"
import { cn } from "@/lib/utils"

type AuthMarketingPanelProps = {
  className?: string
  brandHref?: "/signin" | "/signup"
}

export default function AuthMarketingPanel({
  className,
  brandHref = "/signup",
}: AuthMarketingPanelProps) {
  return (
    <div
      className={cn(
        "relative h-full min-h-[calc(100svh-3rem)] w-full overflow-hidden rounded-2xl bg-[url('https://dev.radianos.com/blocks/illustration-gradient.jpg')] bg-cover bg-top-left bg-no-repeat pl-30 pt-32.5",
        className
      )}
    >
      <div className="relative z-10 flex max-w-120 flex-col gap-4 text-white">
        <AppBrand
          href={brandHref}
          size={32}
          priority
          className="text-white"
          nameClassName="text-white"
        />
        <h4 className="text-2xl font-semibold tracking-tight">
          Manage Your Business with Clarity, Confidence &amp; Control
        </h4>
        <p className="text-base text-white">
          Organize finances, reduce errors, and gain actionable insights to make
          smarter decisions for your business growth.
        </p>
      </div>
    </div>
  )
}
