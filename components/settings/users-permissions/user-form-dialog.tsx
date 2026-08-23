"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { CompanyBranchMultiselect } from "@/components/settings/users-permissions/company-branch-multiselect"
import {
  PermissionGroupFormDialog,
  type PermissionGroupFormValues,
} from "@/components/settings/users-permissions/group-form-dialog"
import { RoleSelect } from "@/components/settings/users-permissions/role-select"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  FormDialogBody,
  FormDialogContent,
  FormDialogFooter,
  FormDialogHeader,
  FormDialogTitle,
} from "@/components/ui/form-dialog"
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
import { normalizeGroupCompanies, type Group } from "@/types/group"
import type { AppUser } from "@/types/user"

const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name is too long" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  address: z.string().trim().max(250, { message: "Address is too long" }),
  contact: z
    .string()
    .trim()
    .min(1, { message: "Contact is required" })
    .min(7, { message: "Please enter a valid contact number" })
    .max(30, { message: "Contact is too long" }),
  designation: z
    .string()
    .trim()
    .max(100, { message: "Designation is too long" }),
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username is too long" }),
  groupId: z.string().min(1, { message: "Select a role" }),
  companyIds: z
    .array(z.string())
    .min(1, { message: "Select at least one company branch" }),
  branchIds: z
    .array(z.string())
    .min(1, { message: "Select at least one branch or head office" }),
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
  existingUsernames: string[]
  existingRoleNames?: string[]
  onSubmit: (values: UserFormValues) => void
  onCreateRole?: (
    values: PermissionGroupFormValues & { companyNames: string[] }
  ) => Group
}

function RequiredMark() {
  return <span className="text-destructive"> *</span>
}

function roleAllowedBranchIds(role: Group | undefined): string[] {
  if (!role) return []
  return normalizeGroupCompanies(role).branchIds ?? []
}

function valuesFromUser(user: AppUser) {
  const groupId = user.assignments[0]?.groupId ?? ""
  const branchIds = user.assignments
    .filter((assignment) => !groupId || assignment.groupId === groupId)
    .map((assignment) => assignment.branchId)

  return { groupId, branchIds }
}

const emptyValues: UserFormInput = {
  name: "",
  email: "",
  address: "",
  contact: "",
  designation: "",
  username: "",
  groupId: "",
  companyIds: [],
  branchIds: [],
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  existingEmails,
  existingUsernames,
  existingRoleNames = [],
  onSubmit,
  onCreateRole,
}: UserFormDialogProps) {
  const isEdit = mode === "edit"
  const defaultRoleId = roles[0]?.id ?? ""
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false)

  const form = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      ...emptyValues,
      groupId: defaultRoleId,
    },
  })

  const selectedRoleId = form.watch("groupId")
  const selectedRole = React.useMemo(
    () => roles.find((role) => role.id === selectedRoleId),
    [roles, selectedRoleId]
  )
  const allowedBranchIds = React.useMemo(
    () => roleAllowedBranchIds(selectedRole),
    [selectedRole]
  )
  const roleHasAccess = allowedBranchIds.length > 0

  React.useEffect(() => {
    if (!open) {
      setRoleDialogOpen(false)
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return

    if (isEdit && user) {
      const fromUser = valuesFromUser(user)
      form.reset({
        name: user.name,
        email: user.email,
        address: user.address ?? "",
        contact: user.contact ?? "",
        designation: user.designation ?? "",
        username: user.username ?? "",
        groupId: fromUser.groupId || defaultRoleId,
        companyIds: [],
        branchIds: fromUser.branchIds,
      })
      return
    }

    form.reset({
      ...emptyValues,
      groupId: defaultRoleId,
    })
  }, [open, isEdit, user, form, defaultRoleId])

  React.useEffect(() => {
    if (!open) return

    const current = form.getValues("branchIds")
    if (allowedBranchIds.length === 0) {
      if (current.length > 0) {
        form.setValue("branchIds", [], { shouldValidate: true })
        form.setValue("companyIds", [], { shouldValidate: true })
      }
      return
    }

    const next = current.filter((id) => allowedBranchIds.includes(id))
    if (next.length !== current.length) {
      form.setValue("branchIds", next, { shouldValidate: true })
    }
  }, [allowedBranchIds, form, open])

  function handleRoleChange(roleId: string) {
    form.setValue("groupId", roleId, { shouldDirty: true, shouldValidate: true })
    form.setValue("branchIds", [], { shouldDirty: true, shouldValidate: true })
    form.setValue("companyIds", [], { shouldDirty: true, shouldValidate: true })
  }

  function handleCreateRole(
    values: PermissionGroupFormValues & { companyNames: string[] }
  ) {
    if (!onCreateRole) return
    const created = onCreateRole(values)
    handleRoleChange(created.id)
  }

  function handleSubmit(values: UserFormInput) {
    const normalizedEmail = values.email.trim().toLowerCase()
    const emailTaken = existingEmails.some(
      (email) =>
        email.toLowerCase() === normalizedEmail &&
        (!isEdit || !user || user.email.toLowerCase() !== normalizedEmail)
    )

    if (emailTaken) {
      form.setError("email", {
        message: "A user with this email already exists",
      })
      return
    }

    const normalizedUsername = values.username.trim().toLowerCase()
    const usernameTaken = existingUsernames.some(
      (username) =>
        username.toLowerCase() === normalizedUsername &&
        (!isEdit ||
          !user ||
          (user.username ?? "").toLowerCase() !== normalizedUsername)
    )

    if (usernameTaken) {
      form.setError("username", {
        message: "A user with this username already exists",
      })
      return
    }

    if (
      values.branchIds.some((branchId) => !allowedBranchIds.includes(branchId))
    ) {
      form.setError("branchIds", {
        message: "Selected branches must belong to this role",
      })
      return
    }

    onSubmit({
      ...values,
      email: normalizedEmail,
      username: values.username.trim(),
      assignments: values.branchIds.map((branchId) => ({
        branchId,
        groupId: values.groupId,
      })),
    })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal={roleDialogOpen}
    >
      <FormDialogContent size="xl">
        <FormDialogHeader>
          <FormDialogTitle>
            {isEdit ? "Edit User" : "Create User"}
          </FormDialogTitle>
        </FormDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <FormDialogBody className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
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
                    <FormLabel>
                      Email
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
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
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Designation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Username
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        autoComplete="username"
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
                  <FormItem className="sm:col-span-2 lg:col-span-3">
                    <FormLabel>
                      Role
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <RoleSelect
                        active={open && !roleDialogOpen}
                        value={field.value}
                        onChange={handleRoleChange}
                        onBlur={field.onBlur}
                        roles={roles}
                        disabled={roles.length === 0 && !onCreateRole}
                        placeholder="Select role…"
                        aria-invalid={Boolean(form.formState.errors.groupId)}
                        onCreateNew={
                          onCreateRole
                            ? () => setRoleDialogOpen(true)
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchIds"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2 lg:col-span-3">
                    <FormLabel>
                      Companies & branches
                      <RequiredMark />
                    </FormLabel>
                    <FormControl>
                      <CompanyBranchMultiselect
                        active={open}
                        allowedBranchIds={allowedBranchIds}
                        disabled={!selectedRoleId || !roleHasAccess}
                        placeholder={
                          !selectedRoleId
                            ? "Select a role first…"
                            : !roleHasAccess
                              ? "This role has no companies or branches"
                              : "Select companies & branches…"
                        }
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
                      Companies and branches shown here are based on the
                      selected role.
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
            </FormDialogBody>

            <FormDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={roles.length === 0}>
                {isEdit ? "Save changes" : "Save"}
              </Button>
            </FormDialogFooter>
          </form>
        </Form>

        {onCreateRole ? (
          <PermissionGroupFormDialog
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            mode="create"
            existingNames={existingRoleNames}
            onSubmit={handleCreateRole}
          />
        ) : null}
      </FormDialogContent>
    </Dialog>
  )
}
