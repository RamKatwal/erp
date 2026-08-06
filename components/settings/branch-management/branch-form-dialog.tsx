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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Branch } from "@/types/branch"

const branchFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Branch name is required" })
    .max(100, { message: "Branch name is too long" }),
  code: z
    .string()
    .trim()
    .min(1, { message: "Branch code is required" })
    .max(20, { message: "Branch code is too long" })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: "Use letters, numbers, hyphens, or underscores only",
    }),
  address: z
    .string()
    .trim()
    .min(1, { message: "Address is required" })
    .max(250, { message: "Address is too long" }),
  contactNumber: z
    .string()
    .trim()
    .min(1, { message: "Contact number is required" })
    .max(30, { message: "Contact number is too long" }),
  contactEmail: z
    .string()
    .trim()
    .min(1, { message: "Contact email is required" })
    .email({ message: "Please enter a valid email address" }),
})

export type BranchFormValues = z.infer<typeof branchFormSchema>

type BranchFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  branch?: Branch | null
  existingCodes: string[]
  onSubmit: (values: BranchFormValues) => void
}

const emptyValues: BranchFormValues = {
  name: "",
  code: "",
  address: "",
  contactNumber: "",
  contactEmail: "",
}

export function BranchFormDialog({
  open,
  onOpenChange,
  mode,
  branch,
  existingCodes,
  onSubmit,
}: BranchFormDialogProps) {
  const isEdit = mode === "edit"

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: emptyValues,
  })

  React.useEffect(() => {
    if (!open) return

    if (isEdit && branch) {
      form.reset({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        contactNumber: branch.contactNumber,
        contactEmail: branch.contactEmail,
      })
      return
    }

    form.reset(emptyValues)
  }, [open, isEdit, branch, form])

  function handleSubmit(values: BranchFormValues) {
    const normalizedCode = values.code.trim().toUpperCase()
    const codeTaken = existingCodes.some(
      (code) =>
        code.toUpperCase() === normalizedCode &&
        (!isEdit || !branch || branch.code.toUpperCase() !== normalizedCode)
    )

    if (!isEdit && codeTaken) {
      form.setError("code", { message: "Branch code already exists" })
      return
    }

    onSubmit({
      ...values,
      code: isEdit && branch ? branch.code : normalizedCode,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit Branch" : "Add Branch"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update branch details. Branch code cannot be changed."
              : "Create a new branch. It will be Active by default."}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Head Office" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. HQ"
                        disabled={isEdit}
                        {...field}
                      />
                    </FormControl>
                    {isEdit ? (
                      <FormDescription>
                        Branch code cannot be changed after creation.
                      </FormDescription>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Street, city, postal code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+977-1-4210000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="branch@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t px-5 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Save changes" : "Add Branch"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
