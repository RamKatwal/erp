import { getConfigurationsItemByHref } from "@/config/configurations-navigation"
import { ModulePage } from "@/components/dashboard/module-page"

type ConfigurationsPlaceholderPageProps = {
  href: string
  fallbackTitle: string
}

export function ConfigurationsPlaceholderPage({
  href,
  fallbackTitle,
}: ConfigurationsPlaceholderPageProps) {
  const item = getConfigurationsItemByHref(href)

  return <ModulePage title={item?.title ?? fallbackTitle} />
}
