import { redirect } from "next/navigation"

import { getDefaultConfigurationsHref } from "@/config/configurations-navigation"

export default function ConfigurationsIndexPage() {
  redirect(getDefaultConfigurationsHref())
}
