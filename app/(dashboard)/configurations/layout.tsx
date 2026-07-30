import { ConfigurationsShell } from "@/components/settings/configurations-shell"

export default function ConfigurationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConfigurationsShell>{children}</ConfigurationsShell>
}
