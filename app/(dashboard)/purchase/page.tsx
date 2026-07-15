import { getNavItemByHref } from "@/config/navigation"
import { ModuleOverview } from "@/components/dashboard/module-overview"

export default function PurchasePage() {
  const module = getNavItemByHref("/purchase")

  return (
    <ModuleOverview
      title="Purchase"
      description="Handle purchase invoices, orders, requisitions, expenses, and payments."
      items={module?.children ?? []}
    />
  )
}
