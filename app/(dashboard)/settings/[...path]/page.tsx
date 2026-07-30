import { redirect } from "next/navigation"

import { getDefaultConfigurationsHref } from "@/config/configurations-navigation"

const modalOnlySections = new Set([
  "appearance",
  "notifications",
  "keyboard-shortcuts",
  "user-activities",
])

type LegacySettingsCatchAllPageProps = {
  params: Promise<{ path: string[] }>
}

export default async function LegacySettingsCatchAllPage({
  params,
}: LegacySettingsCatchAllPageProps) {
  const { path } = await params

  if (path.length === 0 || modalOnlySections.has(path[0])) {
    redirect(getDefaultConfigurationsHref())
  }

  redirect(`/configurations/${path.join("/")}`)
}
