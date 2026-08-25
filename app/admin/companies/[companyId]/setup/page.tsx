import { notFound } from "next/navigation"

import { OrganizationSetupPage } from "@/components/admin/setup/organization-setup-page"
import { getOrganizationSetupByCompanyId } from "@/lib/admin/organization-setup"

export default async function AdminCompanySetupRoute({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params

  if (!getOrganizationSetupByCompanyId(companyId)) {
    notFound()
  }

  return <OrganizationSetupPage companyId={companyId} />
}
