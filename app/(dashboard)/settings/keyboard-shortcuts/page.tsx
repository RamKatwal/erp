import { ShortcutsBrowser } from "@/components/keyboard/shortcuts-browser"
import { getSettingsItemByHref } from "@/config/settings-navigation"

export default function KeyboardShortcutsSettingsPage() {
  const item = getSettingsItemByHref("/settings/keyboard-shortcuts")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {item?.title ?? "Keyboard Shortcuts"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {item?.description ??
            "Browse and search every shortcut available across the workspace."}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <ShortcutsBrowser />
      </div>
    </div>
  )
}
