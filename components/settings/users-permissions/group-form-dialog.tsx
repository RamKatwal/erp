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
import type { Group } from "@/types/group"

const groupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Group name is required" })
    .max(100, { message: "Group name is too long" }),
  description: z
    .string()
    .trim()
    .max(250, { message: "Description is too long" })
    .optional()
    .or(z.literal("")),
})

export type PermissionGroupFormValues = z.infer<typeof groupFormSchema>

type PermissionGroupFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  group?: Group | null
  existingNames: string[]
  onSubmit: (values: PermissionGroupFormValues) => void
}

const emptyValues: PermissionGroupFormValues = {
  name: "",
  description: "",
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
      form.reset({
        name: group.name,
        description: group.description,
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
        (!isEdit || !group || group.name.toLowerCase() !== normalizedName.toLowerCase())
    )

    if (nameTaken) {
      form.setError("name", { message: "A group with this name already exists" })
      return
    }

    onSubmit({
      name: normalizedName,
      description: values.description?.trim() ?? "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit Group" : "Add Group"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the group name. Permissions are configured per branch in Permission Management."
              : "Create a group with no permissions. Assign module access later per branch."}
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
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Branch Cashier" {...field} />
                    </FormControl>
                    <FormMessage />
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
                        placeholder="Who typically belongs to this group?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional. Helps others know when to use this group.
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
