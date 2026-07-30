import type { NavItem } from "@/types/navigation"

import { ModuleNavCard } from "@/components/dashboard/module-nav-card"
import { PageHeader } from "@/components/layout/page-header"

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
    <div className="flex flex-col gap-4">
      <PageHeader title={title} description={description} />

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
