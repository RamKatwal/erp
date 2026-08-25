const FAVICON_SERVICE_BASE = "https://favicon.im"

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

/**
 * High-res company logo URL for a domain.
 * Uses favicon.im (apple-touch / manifest icons when available) instead of
 * Google's often-compressed 16–32px favicon cache.
 */
export function getFaviconUrl(domain: string, size = 256): string {
  const normalized = normalizeDomain(domain) ?? domain.trim()
  const larger = size >= 64 ? "true" : "false"
  return `${FAVICON_SERVICE_BASE}/${encodeURIComponent(normalized)}?larger=${larger}`
}

/** Request size for retina-sharp logos at a given CSS pixel size. */
export function logoImageSize(displayPx: number): number {
  return Math.min(512, Math.max(128, Math.round(displayPx * 2)))
}

export function companyInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}
