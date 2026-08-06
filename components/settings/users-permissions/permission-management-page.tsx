"use client"

import * as React from "react"
import { Save } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { PermissionMatrix } from "@/components/settings/group-management/permission-matrix"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { readBranches } from "@/lib/branches/storage"
import { createEmptyGroupPermissions } from "@/lib/groups/permissions"
import { mockBranches } from "@/lib/mock/branches"
import { mockPermissionGroups } from "@/lib/mock/permission-groups"
import { readPermissionGroups } from "@/lib/users/groups-storage"
import {
  readGroupBranchPermission,
  upsertGroupBranchPermission,
} from "@/lib/users/permission-storage"
import type { Branch } from "@/types/branch"
import type { Group, GroupPermissions } from "@/types/group"

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"

export function PermissionManagementPage() {
  const [groups, setGroups] = React.useState<Group[]>(mockPermissionGroups)
  const [branches, setBranches] = React.useState<Branch[]>(mockBranches)
  const [groupId, setGroupId] = React.useState("")
  const [branchId, setBranchId] = React.useState("")
  const [permissions, setPermissions] = React.useState<GroupPermissions>(
    createEmptyGroupPermissions()
  )
  const [saved, setSaved] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const nextGroups = readPermissionGroups()
    const nextBranches = readBranches().filter(
      (branch) => branch.status === "active"
    )
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroups(nextGroups)
    setBranches(nextBranches)

    const initialGroupId = nextGroups[0]?.id ?? ""
    const initialBranchId = nextBranches[0]?.id ?? ""
    setGroupId(initialGroupId)
    setBranchId(initialBranchId)

    if (initialGroupId && initialBranchId) {
      setPermissions(readGroupBranchPermission(initialGroupId, initialBranchId))
    } else {
      setPermissions(createEmptyGroupPermissions())
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated || !groupId || !branchId) return
    setPermissions(readGroupBranchPermission(groupId, branchId))
    setSaved(false)
  }, [groupId, branchId, hydrated])

  const selectedGroup = groups.find((group) => group.id === groupId)
  const selectedBranch = branches.find((branch) => branch.id === branchId)
  const canConfigure = Boolean(groupId && branchId)

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
        description="Select a group and branch, then configure the permission matrix. Users in that group at that branch receive these permissions on next page load."
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
          <select
            id="permission-group"
            className={selectClassName}
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            disabled={groups.length === 0}
          >
            {groups.length === 0 ? (
              <option value="">No groups available</option>
            ) : (
              groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="permission-branch">Branch</Label>
          <select
            id="permission-branch"
            className={selectClassName}
            value={branchId}
            onChange={(event) => setBranchId(event.target.value)}
            disabled={branches.length === 0}
          >
            {branches.length === 0 ? (
              <option value="">No active branches</option>
            ) : (
              branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))
            )}
          </select>
        </div>

        {selectedGroup && selectedBranch ? (
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Editing permissions for{" "}
            <span className="font-medium text-foreground">
              {selectedGroup.name}
            </span>{" "}
            at{" "}
            <span className="font-medium text-foreground">
              {selectedBranch.name}
            </span>
            .
          </p>
        ) : (
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Create a group and at least one active branch to configure
            permissions.
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
