import { getNavItemByHref } from "@/config/navigation"
import { ModuleOverview } from "@/components/dashboard/module-overview"

export default function SalesPage() {
  const module = getNavItemByHref("/sales")

  return (
    <ModuleOverview
      title="Sales"
      description="Manage sales invoices, orders, quotations, delivery notes, and payments."
      items={module?.children ?? []}
    />
  )
}
