import { getNavItemByHref } from "@/config/navigation"
import { ModuleOverview } from "@/components/dashboard/module-overview"

export default function AccountingPage() {
  const module = getNavItemByHref("/accounting")

  return <ModuleOverview title="Accounting" items={module?.children ?? []} />
}
