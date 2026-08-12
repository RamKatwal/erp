"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { SettingUpScreen } from "@/components/onboarding/setting-up-screen"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  apiJson,
  clearOnboardingDraftsClient,
  restoreOnboardingSessionFromClient,
  saveOnboardingSessionClient,
} from "@/lib/onboarding/client-session"
import type {
  OnboardingSessionData,
  OnboardingUserInvite,
  OnboardingUsersDraft,
} from "@/lib/onboarding/session-types"
import { createUserId, readUsers, saveUsers, todayIsoDate } from "@/lib/users/storage"
import type { AppUser } from "@/types/user"
import { readActiveBranchId } from "@/lib/branches/storage"

const InviteSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "member"]),
})

const FormSchema = z.object({
  ownerName: z.string().min(1, { message: "Your name is required" }),
  ownerEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email" }),
  ownerPhone: z.string().optional(),
  invites: z.array(InviteSchema),
})

function newInvite(): OnboardingUserInvite {
  return {
    id: `invite-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: "",
    email: "",
    role: "member",
  }
}

function persistUsersLocally(draft: OnboardingUsersDraft) {
  const branchId = readActiveBranchId()
  const existing = readUsers()
  const byEmail = new Set(existing.map((u) => u.email.toLowerCase()))

  const next: AppUser[] = [...existing]

  const ownerEmail = draft.ownerEmail.toLowerCase()
  if (!byEmail.has(ownerEmail)) {
    next.unshift({
      id: createUserId(ownerEmail),
      name: draft.ownerName,
      email: ownerEmail,
      status: "active",
      assignments: branchId
        ? [{ branchId, groupId: "grp-admin" }]
        : [],
      createdAt: todayIsoDate(),
    })
    byEmail.add(ownerEmail)
  }

  for (const invite of draft.invites) {
    const email = invite.email.trim().toLowerCase()
    if (!email || byEmail.has(email)) continue
    next.push({
      id: createUserId(email),
      name: invite.name.trim() || email,
      email,
      status: "active",
      assignments: branchId
        ? [
            {
              branchId,
              groupId: invite.role === "admin" ? "grp-admin" : "grp-staff",
            },
          ]
        : [],
      createdAt: todayIsoDate(),
    })
    byEmail.add(email)
  }

  saveUsers(next)
}

export default function UsersSetupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get("email")?.trim() ?? ""

  const [hydrated, setHydrated] = React.useState(false)
  const [isSettingUp, setIsSettingUp] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ownerName: "",
      ownerEmail: emailFromQuery,
      ownerPhone: "",
      invites: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "invites",
  })

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const session = await restoreOnboardingSessionFromClient()
        if (cancelled) return
        if (session) saveOnboardingSessionClient(session)

        const draft = session?.users
        form.reset({
          ownerName: draft?.ownerName ?? "",
          ownerEmail:
            draft?.ownerEmail ||
            session?.email ||
            emailFromQuery ||
            "",
          ownerPhone: draft?.ownerPhone ?? "",
          invites: draft?.invites?.length ? draft.invites : [],
        })
      } catch {
        if (emailFromQuery) form.setValue("ownerEmail", emailFromQuery)
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [emailFromQuery, form])

  async function finish(users: OnboardingUsersDraft, skipInvites: boolean) {
    setIsLoading(true)
    try {
      const res = await apiJson<{ session: OnboardingSessionData }>(
        "/api/onboarding/users",
        {
          method: "POST",
          body: JSON.stringify({ users, skipInvites }),
        }
      )
      saveOnboardingSessionClient(res.session)
      persistUsersLocally({
        ...users,
        invites: skipInvites ? [] : users.invites,
      })
      clearOnboardingDraftsClient()
      setIsSettingUp(true)
      window.setTimeout(() => {
        router.push("/admin")
      }, 2800)
    } catch (e) {
      form.setError("ownerName", {
        message:
          e instanceof Error ? e.message : "Could not save users. Try again.",
      })
      setIsLoading(false)
    }
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const invites = data.invites.filter(
      (row) => row.email.trim() || row.name.trim()
    )
    for (const invite of invites) {
      if (!invite.email.trim() || !invite.name.trim()) {
        form.setError("invites", {
          message: "Each invite needs a name and email, or remove the row.",
        })
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email.trim())) {
        form.setError("invites", {
          message: "One or more invite emails are invalid.",
        })
        return
      }
    }

    void finish(
      {
        ownerName: data.ownerName.trim(),
        ownerEmail: data.ownerEmail.trim(),
        ownerPhone: data.ownerPhone?.trim(),
        invites,
      },
      false
    )
  }

  function handleSkipInvites() {
    const values = form.getValues()
    if (!values.ownerName.trim() || !values.ownerEmail.trim()) {
      void form.trigger(["ownerName", "ownerEmail"])
      return
    }
    void finish(
      {
        ownerName: values.ownerName.trim(),
        ownerEmail: values.ownerEmail.trim(),
        ownerPhone: values.ownerPhone?.trim(),
        invites: [],
      },
      true
    )
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size={24} variant="default" />
      </div>
    )
  }

  if (isSettingUp) {
    return <SettingUpScreen open />
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8 md:py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Set up users
        </h1>
        <p className="text-sm text-muted-foreground">
          Confirm your owner account, then optionally invite teammates. You can
          skip invites and add people later from settings.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Account owner
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="h-10" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownerPhone"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Invite teammates
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(newInvite())}
              >
                <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
                Add invite
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="rounded-lg bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
                No invites yet. Add teammates now, or skip and invite later.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 rounded-lg bg-card p-3 ring-1 ring-foreground/10 sm:grid-cols-[1fr_1fr_auto_auto]"
                  >
                    <FormField
                      control={form.control}
                      name={`invites.${index}.name`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Name</FormLabel>
                          <FormControl>
                            <Input className="h-10" placeholder="Name" {...f} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`invites.${index}.email`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Email</FormLabel>
                          <FormControl>
                            <Input
                              className="h-10"
                              placeholder="Email"
                              type="email"
                              {...f}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`invites.${index}.role`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Role</FormLabel>
                          <FormControl>
                            <select
                              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                              value={f.value}
                              onChange={f.onChange}
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove invite"
                      onClick={() => remove(index)}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {form.formState.errors.invites?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.invites.message}
              </p>
            ) : null}
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={isLoading}
              onClick={handleSkipInvites}
            >
              Skip invites & finish
            </Button>
            <Button type="submit" className="h-11" disabled={isLoading}>
              {isLoading ? (
                <Spinner size={18} variant="default" />
              ) : (
                "Save & finish setup"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
