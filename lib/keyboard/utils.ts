export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    Boolean(target.closest("[role='textbox']"))
  )
}

export function isMacPlatform() {
  if (typeof navigator === "undefined") {
    return false
  }

  return /Mac|iPhone|iPad|iPod/.test(navigator.platform)
}

/** Mod key glyph for display: ⌘ on Mac, Ctrl elsewhere */
export function modKeyLabel(isMac: boolean) {
  return isMac ? "⌘" : "Ctrl"
}

export function formatShortcutParts(parts: string[], isMac: boolean): string {
  return parts
    .map((part) => {
      if (part === "Mod" || part === "Ctrl" || part === "Cmd") {
        return modKeyLabel(isMac)
      }
      if (part === "Shift") return isMac ? "⇧" : "Shift"
      if (part === "Alt") return isMac ? "⌥" : "Alt"
      if (part === "Enter") return "↵"
      if (part === "Backspace") return isMac ? "⌫" : "Backspace"
      if (part === "Up") return "↑"
      if (part === "Down") return "↓"
      if (part === "Plus") return "+"
      if (part === "Minus") return "−"
      return part
    })
    .join(isMac ? "" : "+")
}

export function focusPageSearch() {
  const el = document.querySelector<HTMLInputElement>(
    "[data-page-search='true']"
  )
  if (!el) return false
  el.focus()
  el.select?.()
  return true
}
