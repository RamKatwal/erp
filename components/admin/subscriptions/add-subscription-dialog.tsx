"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  FormDialogBody,
  FormDialogContent,
  FormDialogDescription,
  FormDialogFooter,
  FormDialogHeader,
  FormDialogTitle,
} from "@/components/ui/form-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"

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
      <FormDialogContent size="sm">
        <FormDialogHeader>
          <FormDialogTitle>Add / Upgrade Subscription</FormDialogTitle>
          <FormDialogDescription>
            Create or upgrade a company subscription. Billing is not charged
            until payment is confirmed.
          </FormDialogDescription>
        </FormDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <FormDialogBody>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Omniverse" {...field} />
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
                      <NativeSelect {...field}>
                        {PLAN_OPTIONS.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name}
                          </option>
                        ))}
                      </NativeSelect>
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
                      <NativeSelect {...field}>
                        <option value="month">Monthly</option>
                        <option value="year">Annual</option>
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormDialogBody>

            <FormDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save subscription</Button>
            </FormDialogFooter>
          </form>
        </Form>
      </FormDialogContent>
    </Dialog>
  )
}
