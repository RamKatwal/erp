"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const selectClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-[3px]"

const addSubscriptionSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" })
    .max(120, { message: "Company name is too long" }),
  planId: z.string().min(1, { message: "Select a plan" }),
  interval: z.enum(["month", "year"]),
})

export type AddSubscriptionFormValues = z.infer<typeof addSubscriptionSchema>

const PLAN_OPTIONS = [
  { id: "plan_del_01", name: "De-lite Plan" },
  { id: "plan_std_01", name: "Standard Plan" },
  { id: "plan_ent_01", name: "Enterprise Plan" },
] as const

type AddSubscriptionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: AddSubscriptionFormValues) => void
}

const emptyValues: AddSubscriptionFormValues = {
  companyName: "",
  planId: "plan_std_01",
  interval: "year",
}

export function AddSubscriptionDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddSubscriptionDialogProps) {
  const form = useForm<AddSubscriptionFormValues>({
    resolver: zodResolver(addSubscriptionSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: emptyValues,
  })

  React.useEffect(() => {
    if (!open) return
    form.reset(emptyValues)
  }, [open, form])

  function handleSubmit(values: AddSubscriptionFormValues) {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">
            Add / Upgrade Subscription
          </DialogTitle>
          <DialogDescription>
            Create or upgrade a company subscription. Billing is not charged
            until payment is confirmed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-col gap-4 overflow-y-auto px-5 py-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ABC Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <FormControl>
                      <select className={selectClassName} {...field}>
                        {PLAN_OPTIONS.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing interval</FormLabel>
                    <FormControl>
                      <select className={selectClassName} {...field}>
                        <option value="month">Monthly</option>
                        <option value="year">Annual</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="shrink-0 border-t px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save subscription</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
