import { getNavItemByHref } from "@/config/navigation"
import { ModuleOverview } from "@/components/dashboard/module-overview"

export default function AccountingPage() {
  const module = getNavItemByHref("/accounting")

  return (
    <ModuleOverview
      title="Accounting"
      description="Manage vouchers, chart of accounts, bank accounts, and cheques."
      items={module?.children ?? []}
    />
  )
}
