"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Save } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { PermissionMatrix } from "@/components/settings/group-management/permission-matrix"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  getBranchesByIds,
  type ResolvedBranchOption,
} from "@/lib/companies/options"
import { createEmptyGroupPermissions } from "@/lib/groups/permissions"
import { mockPermissionGroups } from "@/lib/mock/permission-groups"
import { readPermissionGroups } from "@/lib/users/groups-storage"
import {
  readGroupBranchPermission,
  upsertGroupBranchPermission,
} from "@/lib/users/permission-storage"
import { cn } from "@/lib/utils"
import { normalizeGroupCompanies, type Group, type GroupPermissions } from "@/types/group"

type AccessSelectOption = {
  value: string
  label: string
}

function AccessSelect({
  id,
  value,
  onValueChange,
  disabled,
  placeholder,
  options,
}: {
  id: string
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  placeholder: string
  options: AccessSelectOption[]
}) {
  const selected = options.find((option) => option.value === value)
  const isDisabled = disabled || options.length === 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isDisabled}
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={isDisabled}
            className="h-9 w-full justify-between px-3 font-normal"
          />
        }
      >
        <span
          className={cn(
            "min-w-0 truncate",
            !selected && "text-muted-foreground"
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onValueChange(option.value)}
          >
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.value === value ? (
              <Check className="ml-auto size-4 shrink-0" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function roleAllowedBranchIds(role: Group | undefined): string[] {
  if (!role) return []
  const normalized = normalizeGroupCompanies(role)
  return normalized.branchIds ?? []
}

function formatBranchOption(branch: ResolvedBranchOption) {
  const officeLabel = branch.isHeadOffice
    ? `${branch.name} (Head Office)`
    : branch.name
  return `${officeLabel} · ${branch.companyName}`
}

export function PermissionManagementPage() {
  const [groups, setGroups] = React.useState<Group[]>(mockPermissionGroups)
  const [groupId, setGroupId] = React.useState("")
  const [branchId, setBranchId] = React.useState("")
  const [permissions, setPermissions] = React.useState<GroupPermissions>(
    createEmptyGroupPermissions()
  )
  const [saved, setSaved] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  const selectedGroup = groups.find((group) => group.id === groupId)
  const allowedBranches = React.useMemo(
    () => getBranchesByIds(roleAllowedBranchIds(selectedGroup)),
    [selectedGroup]
  )
  const selectedBranch = allowedBranches.find(
    (branch) => branch.id === branchId
  )
  const canConfigure = Boolean(groupId && branchId && selectedBranch)

  React.useEffect(() => {
    const nextGroups = readPermissionGroups()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroups(nextGroups)

    const initialGroup = nextGroups[0]
    const initialGroupId = initialGroup?.id ?? ""
    const initialBranches = getBranchesByIds(
      roleAllowedBranchIds(initialGroup)
    )
    const initialBranchId = initialBranches[0]?.id ?? ""

    setGroupId(initialGroupId)
    setBranchId(initialBranchId)

    if (initialGroupId && initialBranchId) {
      setPermissions(
        readGroupBranchPermission(initialGroupId, initialBranchId)
      )
    } else {
      setPermissions(createEmptyGroupPermissions())
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated || !groupId) return

    const group = groups.find((item) => item.id === groupId)
    const nextBranches = getBranchesByIds(roleAllowedBranchIds(group))
    const nextBranchId = nextBranches.some((branch) => branch.id === branchId)
      ? branchId
      : (nextBranches[0]?.id ?? "")

    if (nextBranchId !== branchId) {
      setBranchId(nextBranchId)
      return
    }

    if (!nextBranchId) {
      setPermissions(createEmptyGroupPermissions())
      setSaved(false)
      return
    }

    setPermissions(readGroupBranchPermission(groupId, nextBranchId))
    setSaved(false)
  }, [groupId, branchId, groups, hydrated])

  function handleGroupChange(nextGroupId: string) {
    setGroupId(nextGroupId)
    setSaved(false)
  }

  function handleBranchChange(nextBranchId: string) {
    setBranchId(nextBranchId)
    setSaved(false)
  }

  function handlePermissionsChange(next: GroupPermissions) {
    setSaved(false)
    setPermissions(next)
  }

  function handleSave() {
    if (!groupId || !branchId) return
    upsertGroupBranchPermission(groupId, branchId, permissions)
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Permission Management"
        description="Select a group and one of its assigned branches, then configure the permission matrix. Users in that group at that branch receive these permissions on next page load."
        actions={
          <Button size="sm" onClick={handleSave} disabled={!canConfigure}>
            <Save />
            {saved ? "Saved" : "Save"}
          </Button>
        }
      />

      <section className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="permission-group">Group</Label>
          <AccessSelect
            id="permission-group"
            value={groupId}
            onValueChange={handleGroupChange}
            disabled={groups.length === 0}
            placeholder="No groups available"
            options={groups.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="permission-branch">Branch access</Label>
          <AccessSelect
            id="permission-branch"
            value={branchId}
            onValueChange={handleBranchChange}
            disabled={allowedBranches.length === 0}
            placeholder={
              selectedGroup
                ? "No branches assigned to this group"
                : "Select a group first"
            }
            options={allowedBranches.map((branch) => ({
              value: branch.id,
              label: formatBranchOption(branch),
            }))}
          />
        </div>

        {selectedGroup && selectedBranch ? (
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Editing permissions for{" "}
            <span className="font-medium text-foreground">
              {selectedGroup.name}
            </span>{" "}
            at{" "}
            <span className="font-medium text-foreground">
              {formatBranchOption(selectedBranch)}
            </span>
            .
          </p>
        ) : selectedGroup ? (
          <p className="text-xs text-muted-foreground sm:col-span-2">
            This group has no branch access yet. Edit the role under User Roles
            and assign companies/branches first.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Create a group with branch access to configure permissions.
          </p>
        )}
      </section>

      {canConfigure ? (
        <PermissionMatrix
          permissions={permissions}
          onChange={handlePermissionsChange}
        />
      ) : null}
    </div>
  )
}
