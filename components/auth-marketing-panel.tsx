import Image from "next/image"

import { AppBrand } from "@/components/app-brand"
import { cn } from "@/lib/utils"

type AuthMarketingPanelProps = {
  className?: string
}

export default function AuthMarketingPanel({
  className,
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
          href="/signup"
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

      {/* Bottom-right preview — oversized so overflow-hidden clips edges */}
      <div className="pointer-events-none absolute top-[48%] -right-[12%] left-16 lg:left-30">
        <Image
          src="/images/signup-dashboard.png"
          alt="Omniverse dashboard preview"
          width={2048}
          height={1056}
          quality={100}
          sizes="(min-width: 768px) 55vw, 100vw"
          className="h-auto w-[125%] max-w-none object-cover object-left-top drop-shadow-2xl"
          priority
          unoptimized
        />
      </div>
    </div>
  )
}
