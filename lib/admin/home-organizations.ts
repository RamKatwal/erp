import type { Subscription } from "@/types/subscription"
import { mockSubscriptions } from "@/lib/mock/subscriptions"

export type HomeOrganization = Subscription & {
  location: string
}

const organizationLocations: Record<string, string> = {
  comp_10294: "Suryabinayak, Bhaktapur",
  comp_10881: "Thamel, Kathmandu",
  comp_11002: "Pulchowk, Lalitpur",
  comp_11140: "New Baneshwor, Kathmandu",
}

export const homeOrganizations: HomeOrganization[] = mockSubscriptions.map(
  (subscription) => ({
    ...subscription,
    location:
      organizationLocations[subscription.companyId] ?? "Kathmandu, Nepal",
  })
)

export function organizationNeedsUpgrade(org: Pick<HomeOrganization, "status" | "isTrial">) {
  return org.status === "past_due" || org.status === "trialing" || org.isTrial
}
