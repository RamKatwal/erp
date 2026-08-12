/** Edge-safe cookie payload helpers (no Node Buffer). */

export function encodeCookieValue(data: unknown): string {
  const json = JSON.stringify(data)
  if (typeof btoa === "function") {
    const bytes = new TextEncoder().encode(json)
    let binary = ""
    bytes.forEach((b) => {
      binary += String.fromCharCode(b)
    })
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  }
  return json
}

export function decodeCookieValue<T>(raw: string | undefined | null): T | null {
  if (!raw) return null
  try {
    let json = raw
    if (!raw.startsWith("{") && !raw.startsWith("[")) {
      const padded = raw.replace(/-/g, "+").replace(/_/g, "/")
      const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
      const binary = atob(padded + pad)
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      json = new TextDecoder().decode(bytes)
    }
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
