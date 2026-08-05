"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Add01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { clearPlanSelection } from "@/lib/onboarding/storage"
import { cn } from "@/lib/utils"

const INDUSTRY_OPTIONS = [
  "Automobiles",
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Services",
  "Hospitality",
  "Healthcare",
  "Education",
  "Technology",
  "Other",
] as const

const FormSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  contact: z
    .string()
    .min(1, { message: "Contact is required" })
    .min(7, { message: "Please enter a valid contact number" }),
  pan: z.string().min(1, { message: "PAN is required" }),
  registeredWithVat: z.boolean(),
  industryType: z.string().min(1, { message: "Industry type is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  district: z.string().min(1, { message: "District is required" }),
  fullAddress: z.string().min(1, { message: "Full address is required" }),
  companyWebsite: z.string().optional(),
  employeeNumber: z.string().optional(),
})

const inputClassName = "h-10 text-sm md:text-sm"

function RequiredMark() {
  return <span className="text-destructive"> *</span>
}

export default function CompanyDetailsForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get("email")?.trim() ?? ""

  const [isLoading, setIsLoading] = React.useState(false)
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
  const [logoError, setLogoError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      companyName: "",
      email: emailFromQuery,
      contact: "",
      pan: "",
      registeredWithVat: false,
      industryType: "Automobiles",
      province: "",
      district: "",
      fullAddress: "",
      companyWebsite: "",
      employeeNumber: "",
    },
  })

  React.useEffect(() => {
    if (emailFromQuery) {
      form.setValue("email", emailFromQuery)
    }
  }, [emailFromQuery, form])

  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
    }
  }, [logoPreview])

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setLogoError(null)

    if (!file) return

    const allowed = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowed.includes(file.type)) {
      setLogoError("Use JPG, PNG, or JPEG.")
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setLogoError("Logo must be 4 MB or smaller.")
      return
    }

    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoPreview(URL.createObjectURL(file))
  }

  const onSubmit = (_data: z.infer<typeof FormSchema>) => {
    setIsLoading(true)
    clearPlanSelection()
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin")
    }, 700)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Add company information
        </h1>
        <p className="text-sm text-muted-foreground">
          Tell us about your business so we can set up your workspace.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 rounded-lg bg-card p-5 text-card-foreground ring-1 ring-foreground/10 md:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex size-24 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted/50",
                logoPreview && "border-solid"
              )}
              aria-label="Upload company logo"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="size-full object-cover"
                />
              ) : (
                <>
                  <HugeiconsIcon icon={Add01Icon} className="size-5" />
                  <span className="mt-1 text-[11px] font-medium">Upload</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="sr-only"
              onChange={handleLogoChange}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Company logo{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </p>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                Use a square (1:1) logo for best results. JPG, PNG or JPEG (Max.
                4 MB).
              </p>
              {logoError ? (
                <p className="text-xs text-destructive">{logoError}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      className={inputClassName}
                      {...field}
                    />
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
                    <Input
                      type="email"
                      placeholder="Enter email"
                      className={inputClassName}
                      {...field}
                    />
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
                    <Input
                      placeholder="Enter contact"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PAN
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter PAN number"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="registeredWithVat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="registered-with-vat"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel
                  htmlFor="registered-with-vat"
                  className="font-normal text-foreground"
                >
                  Registered with VAT
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="industryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Type</FormLabel>
                  <FormControl>
                    <select
                      className={cn(
                        inputClassName,
                        "w-full min-w-0 rounded-md border border-input bg-input/20 px-2 outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                      )}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    >
                      {INDUSTRY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
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
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Province
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter province"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    District
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter district"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Address
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your address"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company site"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter employee number"
                      className={inputClassName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="h-10 min-w-44"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size={18} variant="default" />
              ) : (
                <>
                  Save &amp; Continue
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4"
                    data-icon="inline-end"
                  />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
