"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import {
  DuoAccountingIcon,
  DuoChartOfAccountsIcon,
  DuoOrderIcon,
  DuoPaymentsIcon,
  DuoProductsIcon,
  DuoPurchaseIcon,
  DuoReturnIcon,
  DuoSalesIcon,
} from "@/components/icons/duo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createMenuSections } from "@/lib/dashboard/mock-data"
import type { NavIcon } from "@/types/navigation"

const createActionIcons: Record<string, NavIcon> = {
  "/customers": DuoSalesIcon,
  "/suppliers": DuoPurchaseIcon,
  "/inventory/products": DuoProductsIcon,
  "/accounting/contra": DuoAccountingIcon,
  "/purchase/invoice": DuoPurchaseIcon,
  "/purchase/order": DuoOrderIcon,
  "/purchase/return": DuoReturnIcon,
  "/purchase/payments": DuoPaymentsIcon,
  "/sales/invoice": DuoSalesIcon,
  "/sales/order": DuoOrderIcon,
  "/sales/payments": DuoPaymentsIcon,
  "/sales/return": DuoReturnIcon,
  "/accounting/chart-of-accounts": DuoChartOfAccountsIcon,
  "/accounting/journal-voucher": DuoAccountingIcon,
  "/accounting/payment-voucher": DuoPaymentsIcon,
  "/accounting/receipt-voucher": DuoPaymentsIcon,
}

export function CreateDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="glass" size="sm" className="gap-1 px-2.5" />
        }
      >
        <Plus className="size-3.5" />
        Create
      </DialogTrigger>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">Create</DialogTitle>
          <DialogDescription className="sr-only">
            Quick access to create common records.
          </DialogDescription>
        </DialogHeader>

        <div className="thin-scrollbar max-h-[min(32rem,70vh)] space-y-5 overflow-y-auto px-5 py-4">
          {createMenuSections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {section.items.map((item) => {
                  const Icon = createActionIcons[item.href]

                  return (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="h-auto justify-start gap-2.5 px-3 py-2.5 text-sm font-normal"
                      render={
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                        />
                      }
                    >
                      {Icon ? (
                        <Icon className="size-4 shrink-0 text-foreground" />
                      ) : null}
                      <span className="truncate">{item.label}</span>
                    </Button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
