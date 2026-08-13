"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  CompanyBranchMultiselect,
  getCompanyNamesForIds,
} from "@/components/settings/users-permissions/company-branch-multiselect"
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
import { normalizeGroupCompanies, type Group } from "@/types/group"

const groupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Role name is required" })
    .max(100, { message: "Role name is too long" }),
  description: z
    .string()
    .trim()
    .max(250, { message: "Description is too long" })
    .optional()
    .or(z.literal("")),
  companyIds: z
    .array(z.string())
    .min(1, { message: "Select at least one company branch" }),
  branchIds: z
    .array(z.string())
    .min(1, { message: "Select at least one branch or head office" }),
})

export type PermissionGroupFormValues = z.infer<typeof groupFormSchema>

type PermissionGroupFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  group?: Group | null
  existingNames: string[]
  onSubmit: (
    values: PermissionGroupFormValues & { companyNames: string[] }
  ) => void
}

const emptyValues: PermissionGroupFormValues = {
  name: "",
  description: "",
  companyIds: [],
  branchIds: [],
}

export function PermissionGroupFormDialog({
  open,
  onOpenChange,
  mode,
  group,
  existingNames,
  onSubmit,
}: PermissionGroupFormDialogProps) {
  const isEdit = mode === "edit"

  const form = useForm<PermissionGroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: emptyValues,
  })

  React.useEffect(() => {
    if (!open) return

    if (isEdit && group) {
      const normalized = normalizeGroupCompanies(group)
      form.reset({
        name: normalized.name,
        description: normalized.description,
        companyIds: normalized.companyIds ?? [],
        branchIds: normalized.branchIds ?? [],
      })
      return
    }

    form.reset(emptyValues)
  }, [open, isEdit, group, form])

  function handleSubmit(values: PermissionGroupFormValues) {
    const normalizedName = values.name.trim()
    const nameTaken = existingNames.some(
      (name) =>
        name.toLowerCase() === normalizedName.toLowerCase() &&
        (!isEdit ||
          !group ||
          group.name.toLowerCase() !== normalizedName.toLowerCase())
    )

    if (nameTaken) {
      form.setError("name", {
        message: "A role with this name already exists",
      })
      return
    }

    onSubmit({
      name: normalizedName,
      description: values.description?.trim() ?? "",
      companyIds: values.companyIds,
      companyNames: getCompanyNamesForIds(values.companyIds),
      branchIds: values.branchIds,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit User Role" : "Add User Role"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the role and company branches. Module permissions are configured in Permission Management."
              : "Create a user role and select any companies, head offices, and branches it applies to."}
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
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Branch Cashier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Companies & branches</FormLabel>
                    <FormControl>
                      <CompanyBranchMultiselect
                        active={open}
                        value={{
                          companyIds: form.watch("companyIds"),
                          branchIds: field.value,
                        }}
                        onChange={(next) => {
                          form.setValue("companyIds", next.companyIds, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                          field.onChange(next.branchIds)
                        }}
                        aria-invalid={
                          Boolean(form.formState.errors.branchIds) ||
                          Boolean(form.formState.errors.companyIds)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Select branches and head offices across one or more
                      companies.
                    </FormDescription>
                    <FormMessage />
                    {form.formState.errors.companyIds &&
                    !form.formState.errors.branchIds ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.companyIds.message}
                      </p>
                    ) : null}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Who typically has this role?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional. Helps others know when to use this role.
                    </FormDescription>
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
              <Button type="submit">{isEdit ? "Save changes" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
