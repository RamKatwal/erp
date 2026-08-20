const FAVICON_SERVICE_BASE = "https://www.google.com/s2/favicons"

/** Strip protocol, path, and leading www. from a URL or hostname. */
export function normalizeDomain(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  try {
    const withProtocol = trimmed.includes("//") ? trimmed : `https://${trimmed}`
    const host = new URL(withProtocol).hostname.replace(/^www\./, "")
    return host || null
  } catch {
    const host = trimmed
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/:?#]/)[0]
    return host || null
  }
}

/** Google favicon URL for a company domain (e.g. stripe.com). */
export function getFaviconUrl(domain: string, size = 128): string {
  const normalized = normalizeDomain(domain) ?? domain.trim()
  return `${FAVICON_SERVICE_BASE}?domain=${encodeURIComponent(normalized)}&sz=${size}`
}

export function companyInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}
