"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
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
import type { Branch } from "@/types/branch"
import type { Group } from "@/types/group"
import type { AppUser } from "@/types/user"

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"

const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name is too long" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  assignments: z
    .array(
      z.object({
        branchId: z.string().min(1, { message: "Select a branch" }),
        groupId: z.string().min(1, { message: "Select a group" }),
      })
    )
    .min(1, { message: "Assign at least one entity" }),
})

export type UserFormValues = z.infer<typeof userFormSchema>

type UserFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  user?: AppUser | null
  branches: Branch[]
  groups: Group[]
  existingEmails: string[]
  onSubmit: (values: UserFormValues) => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  branches,
  groups,
  existingEmails,
  onSubmit,
}: UserFormDialogProps) {
  const isEdit = mode === "edit"
  const defaultBranchId = branches[0]?.id ?? ""
  const defaultGroupId = groups[0]?.id ?? ""

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      assignments: [{ branchId: defaultBranchId, groupId: defaultGroupId }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignments",
  })

  React.useEffect(() => {
    if (!open) return

    if (isEdit && user) {
      form.reset({
        name: user.name,
        email: user.email,
        assignments:
          user.assignments.length > 0
            ? user.assignments.map((assignment) => ({ ...assignment }))
            : [{ branchId: defaultBranchId, groupId: defaultGroupId }],
      })
      return
    }

    form.reset({
      name: "",
      email: "",
      assignments: [{ branchId: defaultBranchId, groupId: defaultGroupId }],
    })
  }, [open, isEdit, user, form, defaultBranchId, defaultGroupId])

  function handleSubmit(values: UserFormValues) {
    const normalizedEmail = values.email.trim().toLowerCase()
    const emailTaken = existingEmails.some(
      (email) =>
        email.toLowerCase() === normalizedEmail &&
        (!isEdit || !user || user.email.toLowerCase() !== normalizedEmail)
    )

    if (emailTaken) {
      form.setError("email", { message: "A user with this email already exists" })
      return
    }

    const branchIds = values.assignments.map((item) => item.branchId)
    if (new Set(branchIds).size !== branchIds.length) {
      form.setError("assignments", {
        message: "Each branch can only be assigned once",
      })
      return
    }

    onSubmit({
      ...values,
      email: normalizedEmail,
    })
    onOpenChange(false)
  }

  const canAddAssignment =
    branches.length > 0 &&
    groups.length > 0 &&
    fields.length < branches.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription>
            Permissions come only from the group chosen for each entity. There
            is no individual permission override.
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
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Anita Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Entity assignments</p>
                    <FormDescription>
                      Assign one or more branches, each with its own group.
                    </FormDescription>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!canAddAssignment}
                    onClick={() =>
                      append({
                        branchId: defaultBranchId,
                        groupId: defaultGroupId,
                      })
                    }
                  >
                    <PlusIcon />
                    Add
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <FormField
                      control={form.control}
                      name={`assignments.${index}.branchId`}
                      render={({ field: assignmentField }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <FormControl>
                            <select
                              className={selectClassName}
                              {...assignmentField}
                            >
                              {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                  {branch.name}
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
                      name={`assignments.${index}.groupId`}
                      render={({ field: assignmentField }) => (
                        <FormItem>
                          <FormLabel>Group</FormLabel>
                          <FormControl>
                            <select
                              className={selectClassName}
                              {...assignmentField}
                            >
                              {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                  {group.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={fields.length <= 1}
                        aria-label="Remove assignment"
                        onClick={() => remove(index)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                ))}

                {form.formState.errors.assignments?.root?.message ||
                form.formState.errors.assignments?.message ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.assignments?.root?.message ??
                      form.formState.errors.assignments?.message}
                  </p>
                ) : null}
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
              <Button
                type="submit"
                disabled={branches.length === 0 || groups.length === 0}
              >
                {isEdit ? "Save changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
