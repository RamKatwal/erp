import { organizations, type Organization } from "@/config/organizations"

const ACTIVE_ORG_STORAGE_KEY = "ibmerp-active-organization"

export function readActiveOrganizationId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_ORG_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveActiveOrganizationId(organizationId: string) {
  window.localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, organizationId)
}

/** Prefer the stored active organization when it still exists; otherwise first org. */
export function resolveActiveOrganization(
  orgs: readonly Organization[] = organizations
): Organization | null {
  if (orgs.length === 0) return null

  const storedId = readActiveOrganizationId()
  const stored = storedId
    ? orgs.find((org) => org.id === storedId)
    : undefined

  return stored ?? orgs[0]
}
