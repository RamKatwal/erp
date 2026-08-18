import { notFound } from "next/navigation"

import { InvoiceReceiptView } from "@/components/admin/subscriptions/invoice-receipt-view"
import { getInvoiceReceiptById } from "@/lib/mock/invoice-receipt"

type InvoiceDemoPageProps = {
  params: Promise<{ invoiceId: string }>
}

export default async function InvoiceDemoDetailPage({
  params,
}: InvoiceDemoPageProps) {
  const { invoiceId } = await params
  const receipt = getInvoiceReceiptById(invoiceId)

  if (!receipt) {
    notFound()
  }

  return <InvoiceReceiptView receipt={receipt} />
}
