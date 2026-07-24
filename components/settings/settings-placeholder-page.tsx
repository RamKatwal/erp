import { getSettingsItemByHref } from "@/config/settings-navigation"
import { ModulePage } from "@/components/dashboard/module-page"

type SettingsPlaceholderPageProps = {
  href: string
  fallbackTitle: string
  fallbackDescription: string
}

export function SettingsPlaceholderPage({
  href,
  fallbackTitle,
  fallbackDescription,
}: SettingsPlaceholderPageProps) {
  const item = getSettingsItemByHref(href)

  return (
    <ModulePage
      title={item?.title ?? fallbackTitle}
      description={item?.description ?? fallbackDescription}
    />
  )
}
