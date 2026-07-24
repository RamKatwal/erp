import {
  SettingsMobileNav,
  SettingsNav,
} from "@/components/settings/settings-nav"

type SettingsShellProps = {
  children: React.ReactNode
}

export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <div className="-mx-3 -mb-3 flex min-h-[calc(100svh-7.5rem)] flex-1 overflow-hidden rounded-xl border bg-card shadow-xs md:-mx-4 md:-mb-4">
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r bg-muted/20 md:block">
        <div className="sticky top-0 border-b bg-card/80 px-4 py-3 backdrop-blur-sm">
          <h2 className="text-sm font-semibold tracking-tight">All Settings</h2>
          <p className="text-xs text-muted-foreground">
            Configure organization preferences
          </p>
        </div>
        <SettingsNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b p-3 md:hidden">
          <SettingsMobileNav />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}
