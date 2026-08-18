import { redirect } from "next/navigation"

import { defaultDemoInvoiceId } from "@/lib/mock/invoice-receipt"

export default function InvoiceDemoPage() {
  redirect(`/inv_demo/${defaultDemoInvoiceId}`)
}
