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
import {
  findCompanyForBranch,
  getCompanyById,
  getCompanyOptions,
} from "@/lib/companies/options"
import { normalizeGroupCompanies, type Group } from "@/types/group"
import type { AppUser } from "@/types/user"

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"

const accessSchema = z.object({
  companyId: z.string().min(1, { message: "Select a company" }),
  branchId: z.string().min(1, { message: "Select a branch" }),
})

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
  groupId: z.string().min(1, { message: "Select a role" }),
  access: z
    .array(accessSchema)
    .min(1, { message: "Grant access to at least one branch" }),
})

type UserFormInput = z.infer<typeof userFormSchema>

export type UserFormValues = UserFormInput & {
  assignments: Array<{ branchId: string; groupId: string }>
}

type UserFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  user?: AppUser | null
  roles: Group[]
  existingEmails: string[]
  onSubmit: (values: UserFormValues) => void
}

function roleCompanies(role: Group | undefined) {
  if (!role) return []
  const normalized = normalizeGroupCompanies(role)
  const allowedIds = new Set(normalized.companyIds ?? [])
  return getCompanyOptions().filter((company) => allowedIds.has(company.id))
}

function roleBranchesForCompany(
  role: Group | undefined,
  companyId: string
) {
  if (!role || !companyId) return []
  const normalized = normalizeGroupCompanies(role)
  const allowedBranchIds = new Set(normalized.branchIds ?? [])
  const company = getCompanyById(companyId)
  if (!company) return []

  return company.branches.filter((branch) => allowedBranchIds.has(branch.id))
}

function accessFromUser(user: AppUser) {
  return user.assignments.map((assignment) => ({
    companyId: findCompanyForBranch(assignment.branchId)?.id ?? "",
    branchId: assignment.branchId,
  }))
}

function emptyAccessRow(role: Group | undefined) {
  const companies = roleCompanies(role)
  const firstCompany = companies[0]
  const branches = firstCompany
    ? roleBranchesForCompany(role, firstCompany.id)
    : []

  return {
    companyId: firstCompany?.id ?? "",
    branchId: branches[0]?.id ?? "",
  }
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  existingEmails,
  onSubmit,
}: UserFormDialogProps) {
  const isEdit = mode === "edit"
  const defaultRoleId = roles[0]?.id ?? ""
  const defaultRole = roles.find((role) => role.id === defaultRoleId)

  const form = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      groupId: defaultRoleId,
      access: [emptyAccessRow(defaultRole)],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "access",
  })

  const selectedRoleId = form.watch("groupId")
  const selectedRole = React.useMemo(
    () => roles.find((role) => role.id === selectedRoleId),
    [roles, selectedRoleId]
  )
  const companiesForRole = React.useMemo(
    () => roleCompanies(selectedRole),
    [selectedRole]
  )
  const roleHasAccess = companiesForRole.length > 0

  React.useEffect(() => {
    if (!open) return

    if (isEdit && user) {
      const groupId = user.assignments[0]?.groupId ?? defaultRoleId
      const role = roles.find((item) => item.id === groupId)
      const access = accessFromUser(user)
      form.reset({
        name: user.name,
        email: user.email,
        groupId,
        access:
          access.length > 0 && access.every((item) => item.companyId)
            ? access
            : [emptyAccessRow(role)],
      })
      return
    }

    form.reset({
      name: "",
      email: "",
      groupId: defaultRoleId,
      access: [emptyAccessRow(defaultRole)],
    })
  }, [open, isEdit, user, form, defaultRoleId, defaultRole, roles])

  function handleRoleChange(roleId: string) {
    const role = roles.find((item) => item.id === roleId)
    form.setValue("groupId", roleId, { shouldDirty: true, shouldValidate: true })
    form.setValue("access", [emptyAccessRow(role)], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function handleCompanyChange(index: number, companyId: string) {
    const branches = roleBranchesForCompany(selectedRole, companyId)
    form.setValue(`access.${index}.companyId`, companyId, {
      shouldDirty: true,
      shouldValidate: true,
    })
    form.setValue(`access.${index}.branchId`, branches[0]?.id ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function handleSubmit(values: UserFormInput) {
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

    const branchIds = values.access.map((item) => item.branchId)
    if (new Set(branchIds).size !== branchIds.length) {
      form.setError("access", {
        message: "Each branch can only be assigned once",
      })
      return
    }

    for (const entry of values.access) {
      const allowed = roleBranchesForCompany(selectedRole, entry.companyId)
      if (!allowed.some((branch) => branch.id === entry.branchId)) {
        form.setError("access", {
          message: "Selected branch must belong to this role and company",
        })
        return
      }
    }

    onSubmit({
      ...values,
      email: normalizedEmail,
      assignments: values.access.map((item) => ({
        branchId: item.branchId,
        groupId: values.groupId,
      })),
    })
    onOpenChange(false)
  }

  const canAddAccess =
    roleHasAccess &&
    fields.length <
      companiesForRole.reduce(
        (total, company) =>
          total + roleBranchesForCompany(selectedRole, company.id).length,
        0
      )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription>
            Select a role first, then choose the company and branch this user
            can access.
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

              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select
                        className={selectClassName}
                        value={field.value}
                        onChange={(event) => handleRoleChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      >
                        {roles.length === 0 ? (
                          <option value="">No roles available</option>
                        ) : null}
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Permissions come from this role — no per-user overrides.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Company & branch access</p>
                    <p className="text-muted-foreground text-sm">
                      Pick a company, then a branch allowed for the selected
                      role.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!canAddAccess}
                    onClick={() => append(emptyAccessRow(selectedRole))}
                  >
                    <PlusIcon />
                    Add
                  </Button>
                </div>

                {!roleHasAccess ? (
                  <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-2 text-sm">
                    This role has no companies or branches. Edit the role first.
                  </p>
                ) : null}

                {fields.map((field, index) => {
                  const companyId = form.watch(`access.${index}.companyId`)
                  const branches = roleBranchesForCompany(
                    selectedRole,
                    companyId
                  )

                  return (
                    <div
                      key={field.id}
                      className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]"
                    >
                      <FormField
                        control={form.control}
                        name={`access.${index}.companyId`}
                        render={({ field: companyField }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <select
                                className={selectClassName}
                                value={companyField.value}
                                disabled={!selectedRoleId || !roleHasAccess}
                                onChange={(event) =>
                                  handleCompanyChange(index, event.target.value)
                                }
                                onBlur={companyField.onBlur}
                                name={companyField.name}
                                ref={companyField.ref}
                              >
                                {companiesForRole.length === 0 ? (
                                  <option value="">No companies</option>
                                ) : null}
                                {companiesForRole.map((company) => (
                                  <option key={company.id} value={company.id}>
                                    {company.name}
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
                        name={`access.${index}.branchId`}
                        render={({ field: branchField }) => (
                          <FormItem>
                            <FormLabel>Branch</FormLabel>
                            <FormControl>
                              <select
                                className={selectClassName}
                                {...branchField}
                                disabled={
                                  !selectedRoleId ||
                                  !companyId ||
                                  branches.length === 0
                                }
                              >
                                {branches.length === 0 ? (
                                  <option value="">No branches</option>
                                ) : null}
                                {branches.map((branch) => (
                                  <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                    {branch.isHeadOffice ? " · Head Office" : ""}
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
                          aria-label="Remove access"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {form.formState.errors.access?.root?.message ||
                form.formState.errors.access?.message ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.access?.root?.message ??
                      form.formState.errors.access?.message}
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
              <Button type="submit" disabled={roles.length === 0}>
                {isEdit ? "Save changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
