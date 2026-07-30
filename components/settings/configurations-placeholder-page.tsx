import { getConfigurationsItemByHref } from "@/config/configurations-navigation"
import { ModulePage } from "@/components/dashboard/module-page"

type ConfigurationsPlaceholderPageProps = {
  href: string
  fallbackTitle: string
  fallbackDescription: string
}

export function ConfigurationsPlaceholderPage({
  href,
  fallbackTitle,
  fallbackDescription,
}: ConfigurationsPlaceholderPageProps) {
  const item = getConfigurationsItemByHref(href)

  return (
    <ModulePage
      title={item?.title ?? fallbackTitle}
      description={item?.description ?? fallbackDescription}
    />
  )
}
