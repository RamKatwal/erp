import { z } from "zod"

export const COMPANY_INDUSTRY_OPTIONS = [
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

export const companyConfigurationSchema = z.object({
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

export type CompanyConfigurationFormValues = z.infer<
  typeof companyConfigurationSchema
>
