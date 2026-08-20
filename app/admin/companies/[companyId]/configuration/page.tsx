import { CompanyConfigurationPage } from "@/components/settings/company-configuration/company-configuration-page"

export default async function AdminCompanyConfigurationRoute({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params

  return (
    <CompanyConfigurationPage
      companyId={companyId}
      backHref="/admin/subscriptions"
      backLabel="Back to subscriptions"
    />
  )
}
