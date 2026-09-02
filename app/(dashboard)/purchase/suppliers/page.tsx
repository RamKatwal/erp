import { Suspense } from "react"

import { SuppliersPage } from "@/components/suppliers/suppliers-page"

export default function SuppliersRoute() {
  return (
    <Suspense fallback={null}>
      <SuppliersPage />
    </Suspense>
  )
}
