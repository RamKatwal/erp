import type { NavItem } from "@/types/navigation"

import { ModuleNavCard } from "@/components/dashboard/module-nav-card"

type ModuleOverviewProps = {
  title: string
  description: string
  items: NavItem[]
}

export function ModuleOverview({
  title,
  description,
  items,
}: ModuleOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const Icon = item.icon

          return (
            <ModuleNavCard
              key={item.href}
              title={item.title}
              description={item.description ?? `Open ${item.title}.`}
              href={item.href}
              icon={Icon}
              accentIndex={index}
            />
          )
        })}
      </div>
    </div>
  )
}
