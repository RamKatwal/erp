import { DEMO_COMPANY } from "@/lib/demo/company"
import { appBrand } from "@/config/navigation"
import type { CompanyProfile } from "@/types/company"

import { mockSubscriptions } from "./subscriptions"

const profileOverrides: Record<string, Partial<CompanyProfile>> = {
  comp_10881: {
    ...DEMO_COMPANY,
    domain: "himalaya.com",
  },
  comp_10294: {
    companyName: "Omniverse",
    email: "billing@omniverse.com",
    contact: "+977-9812000001",
    pan: "102940001",
    registeredWithVat: true,
    industryType: "Technology",
    province: "Bagmati",
    district: "Kathmandu",
    fullAddress: "Thapathali, Kathmandu 44600",
    companyWebsite: "https://omniverse.com",
    employeeNumber: "120",
    domain: "omniverse.com",
    logoUrl: appBrand.logo,
  },
  comp_11002: {
    companyName: "Everest Retail Group",
    email: "accounts@everestretail.com",
    contact: "+977-9812000002",
    pan: "110020001",
    registeredWithVat: true,
    industryType: "Retail",
    province: "Bagmati",
    district: "Kathmandu",
    fullAddress: "New Baneshwor, Kathmandu 44600",
    companyWebsite: "https://stripe.com",
    employeeNumber: "85",
    domain: "stripe.com",
  },
  comp_11140: {
    companyName: "Nova Logistics",
    email: "finance@flexport.com",
    contact: "+977-9812000003",
    pan: "111400001",
    registeredWithVat: false,
    industryType: "Services",
    province: "Bagmati",
    district: "Kathmandu",
    fullAddress: "Teku, Kathmandu 44600",
    companyWebsite: "https://www.flexport.com",
    employeeNumber: "32",
    domain: "flexport.com",
  },
}

export const mockCompanyProfiles: CompanyProfile[] = mockSubscriptions.map(
  (subscription) => {
    const override = profileOverrides[subscription.companyId] ?? {}

    return {
      id: subscription.companyId,
      companyName: subscription.companyName,
      email:
        override.email ??
        subscription.paymentMethod?.billingEmail ??
        `contact@${subscription.companyDomain ?? "example.com"}`,
      contact: override.contact ?? "+977-9812345678",
      pan: override.pan ?? subscription.companyId.replace("comp_", ""),
      registeredWithVat: override.registeredWithVat ?? false,
      industryType: override.industryType ?? "Retail",
      province: override.province ?? "Bagmati",
      district: override.district ?? "Kathmandu",
      fullAddress: override.fullAddress ?? "Kathmandu, Nepal",
      companyWebsite:
        override.companyWebsite ??
        (subscription.companyDomain
          ? `https://${subscription.companyDomain}`
          : undefined),
      employeeNumber: override.employeeNumber ?? "24",
      domain: override.domain ?? subscription.companyDomain,
      logoUrl: override.logoUrl ?? null,
    }
  }
)

export function getMockCompanyProfile(
  companyId: string
): CompanyProfile | undefined {
  return mockCompanyProfiles.find((profile) => profile.id === companyId)
}
