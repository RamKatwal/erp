import { getNavItemByHref } from "@/config/navigation"
import { ModuleOverview } from "@/components/dashboard/module-overview"

export default function InventoryPage() {
  const module = getNavItemByHref("/inventory")

  return (
    <ModuleOverview
      title="Inventory"
      description="Manage products, categories, units, and stock adjustments."
      items={module?.children ?? []}
    />
  )
}
