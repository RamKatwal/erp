import { getAllCompanyAccess } from "@/lib/companies/options"
import { ADMIN_ROLE_ID, type Group } from "@/types/group"

const allAccess = getAllCompanyAccess()

const defaultAccess = {
  companyIds: allAccess.companyIds,
  companyNames: allAccess.companyNames,
  branchIds: allAccess.branchIds,
}

/** Seed user roles for the Admin portal. Permissions live on role × branch, not here. */
export const mockPermissionGroups: Group[] = [
  {
    id: ADMIN_ROLE_ID,
    name: "Admin",
    description: "",
    locked: true,
    status: "active",
    entryBy: "Main Admin",
    ...defaultAccess,
  },
  {
    id: "grp-accountant",
    name: "Accountant",
    description: "",
    status: "active",
    entryBy: "Main Admin",
    ...defaultAccess,
  },
  {
    id: "grp-sales",
    name: "Sales",
    description: "",
    status: "active",
    entryBy: "Main Admin",
    ...defaultAccess,
  },
]
