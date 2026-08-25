"use client"

import * as React from "react"

import { CompleteSetupSection } from "@/components/admin/home/complete-setup-section"
import { OrganizationCreatedDialog } from "@/components/admin/home/organization-created-dialog"
import { CompanyListsPage } from "@/components/admin/company-lists-page"

export function AdminHomePage() {
  return (
    <div className="flex flex-col gap-4">
      <CompanyListsPage />

      <CompleteSetupSection />

      <React.Suspense fallback={null}>
        <OrganizationCreatedDialog />
      </React.Suspense>
    </div>
  )
}
