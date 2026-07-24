import type { Group } from "@/types/group"

export const mockGroups: Group[] = [
  {
    id: "grp-admin",
    name: "Admin",
    description: "Unrestricted access to all modules.",
  },
  {
    id: "grp-staff",
    name: "Staff",
    description:
      "Access to all modules except products, reports and settings.",
  },
  {
    id: "grp-accountant",
    name: "Accountant",
    description: "Access to accounting, reports, and financial modules.",
  },
  {
    id: "grp-sales",
    name: "Sales",
    description: "Access to sales orders, quotations, and customer payments.",
  },
  {
    id: "grp-purchase",
    name: "Purchase",
    description: "Access to purchase orders, requisitions, and expenses.",
  },
]
