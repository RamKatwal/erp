import {
  UsersPermissionsMobileNav,
  UsersPermissionsNav,
} from "@/components/settings/users-permissions/users-permissions-nav"

type UsersPermissionsShellProps = {
  children: React.ReactNode
}

export function UsersPermissionsShell({ children }: UsersPermissionsShellProps) {
  return (
    <div className="flex min-h-[calc(100svh-7.5rem)] flex-1 overflow-hidden rounded-xl border bg-card shadow-xs">
      <aside className="hidden w-56 shrink-0 overflow-y-auto border-r bg-muted/20 md:block">
        <div className="sticky top-0 border-b bg-card/80 px-4 py-3 backdrop-blur-sm">
          <h2 className="text-sm font-semibold tracking-tight">
            Users & Permissions
          </h2>
        </div>
        <UsersPermissionsNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b p-3 md:hidden">
          <UsersPermissionsMobileNav />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}
