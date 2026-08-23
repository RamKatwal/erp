"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Pencil, Save } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { PermissionMatrix } from "@/components/settings/group-management/permission-matrix"
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
  className,
}: {
  id: string
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  placeholder: string
  options: AccessSelectOption[]
  className?: string
}) {
  const selected = options.find((option) => option.value === value)
  const isDisabled = disabled || options.length === 0

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        disabled={isDisabled}
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            size="sm"
            disabled={isDisabled}
            className={cn(
              "h-8 w-44 justify-between gap-2 px-2.5 font-normal",
              className
            )}
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
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="thin-scrollbar max-h-64 min-w-(--anchor-width)"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onValueChange(option.value)}
          >
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.value === value ? (
              <Check className="ml-auto size-3.5 shrink-0" />
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
  const officeLabel = branch.isHeadOffice ? "Head office" : branch.name
  return `${officeLabel} · ${branch.companyName}`
}

function clonePermissions(permissions: GroupPermissions): GroupPermissions {
  return Object.fromEntries(
    Object.entries(permissions).map(([key, actions]) => [key, [...actions]])
  )
}

export function PermissionManagementPage() {
  const [groups, setGroups] = React.useState<Group[]>(mockPermissionGroups)
  const [groupId, setGroupId] = React.useState("")
  const [branchId, setBranchId] = React.useState("")
  const [permissions, setPermissions] = React.useState<GroupPermissions>(
    createEmptyGroupPermissions()
  )
  const [permissionsSnapshot, setPermissionsSnapshot] =
    React.useState<GroupPermissions | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

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
    if (isEditing) return
    setGroupId(nextGroupId)
    setSaved(false)
    setConfirmOpen(false)
  }

  function handleBranchChange(nextBranchId: string) {
    if (isEditing) return
    setBranchId(nextBranchId)
    setSaved(false)
    setConfirmOpen(false)
  }

  function handlePermissionsChange(next: GroupPermissions) {
    if (!isEditing) return
    setSaved(false)
    setPermissions(next)
  }

  function handleEdit() {
    if (!canConfigure) return
    setPermissionsSnapshot(clonePermissions(permissions))
    setIsEditing(true)
    setSaved(false)
  }

  function handleCancel() {
    if (permissionsSnapshot) {
      setPermissions(clonePermissions(permissionsSnapshot))
    }
    setPermissionsSnapshot(null)
    setIsEditing(false)
    setSaved(false)
    setConfirmOpen(false)
  }

  function handleSaveClick() {
    if (!canConfigure || !isEditing) return
    setConfirmOpen(true)
  }

  function handleConfirmSave() {
    if (!groupId || !branchId || !isEditing) return
    upsertGroupBranchPermission(groupId, branchId, permissions)
    setPermissionsSnapshot(null)
    setIsEditing(false)
    setSaved(true)
    setConfirmOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Permission Management"
        actions={
          isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveClick}
                disabled={!canConfigure}
              >
                <Save />
                {saved ? "Saved" : "Save"}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={handleEdit}
              disabled={!canConfigure}
            >
              <Pencil />
              Edit permissions
            </Button>
          )
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Label
              htmlFor="permission-group"
              className="shrink-0 text-muted-foreground"
            >
              Group
            </Label>
            <AccessSelect
              id="permission-group"
              value={groupId}
              onValueChange={handleGroupChange}
              disabled={groups.length === 0 || isEditing}
              placeholder="No groups available"
              options={groups.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
            />
          </div>

          <div className="flex min-w-0 items-center gap-2.5">
            <Label
              htmlFor="permission-branch"
              className="shrink-0 text-muted-foreground"
            >
              Branch access
            </Label>
            <AccessSelect
              id="permission-branch"
              value={branchId}
              onValueChange={handleBranchChange}
              disabled={allowedBranches.length === 0 || isEditing}
              className="w-72"
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
        </div>

        {canConfigure ? (
          <PermissionMatrix
            permissions={permissions}
            onChange={handlePermissionsChange}
            readOnly={!isEditing}
          />
        ) : (
          <p className="px-3 py-10 text-center text-sm text-muted-foreground">
            {selectedGroup
              ? "This group has no branch access yet. Assign companies/branches under User Roles first."
              : "Create a group with branch access to configure permissions."}
          </p>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save permissions?</DialogTitle>
            <DialogDescription>
              Apply the current matrix to{" "}
              <span className="font-medium text-foreground">
                {selectedGroup?.name ?? "this group"}
              </span>
              {selectedBranch ? (
                <>
                  {" "}
                  on{" "}
                  <span className="font-medium text-foreground">
                    {formatBranchOption(selectedBranch)}
                  </span>
                </>
              ) : null}
              .
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmSave}>
              <Save />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
