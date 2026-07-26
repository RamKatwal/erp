"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  GROUP_PERMISSION_MODULES,
  getPermissionItemActions,
  type PermissionModule,
} from "@/lib/groups/permissions"
import {
  GROUP_PERMISSION_ACTIONS,
  type GroupPermissionAction,
  type GroupPermissions,
} from "@/types/group"

const ACTION_LABELS: Record<GroupPermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
}

function getModuleSelection(
  module: PermissionModule,
  permissions: GroupPermissions
) {
  const available = module.items.flatMap((item) =>
    getPermissionItemActions(item).map((action) => `${item.id}:${action}`)
  )
  const selected = module.items.flatMap((item) =>
    (permissions[item.id] ?? []).map((action) => `${item.id}:${action}`)
  )

  return {
    isSelected: available.length > 0 && selected.length === available.length,
    available,
  }
}

export function PermissionMatrix({
  permissions,
  onChange,
}: {
  permissions: GroupPermissions
  onChange: (permissions: GroupPermissions) => void
}) {
  function togglePermission(
    itemId: string,
    action: GroupPermissionAction,
    checked: boolean
  ) {
    const current = permissions[itemId] ?? []
    onChange({
      ...permissions,
      [itemId]: checked
        ? [...new Set([...current, action])]
        : current.filter((item) => item !== action),
    })
  }

  function toggleRow(
    itemId: string,
    actions: GroupPermissionAction[],
    checked: boolean
  ) {
    onChange({ ...permissions, [itemId]: checked ? [...actions] : [] })
  }

  function toggleModule(module: PermissionModule, checked: boolean) {
    const next = { ...permissions }
    for (const item of module.items) {
      next[item.id] = checked ? [...getPermissionItemActions(item)] : []
    }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Module permissions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select what members of this group can see and do.
        </p>
      </div>

      <div className="space-y-3">
        {GROUP_PERMISSION_MODULES.map((module) => {
          const moduleSelection = getModuleSelection(module, permissions)

          return (
            <section
              key={module.id}
              className="overflow-hidden rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3 border-b bg-muted/35 px-4 py-3">
                <Checkbox
                  checked={moduleSelection.isSelected}
                  onCheckedChange={(checked) => toggleModule(module, checked)}
                  aria-label={`Full access to ${module.label}`}
                />
                <div>
                  <h3 className="text-sm font-semibold">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {module.items.length} permission areas
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="w-full px-4 py-2.5 text-left font-medium">
                        Permission
                      </th>
                      <th className="px-3 py-2.5 text-center font-medium">
                        Full access
                      </th>
                      {GROUP_PERMISSION_ACTIONS.map((action) => (
                        <th
                          key={action}
                          className="px-3 py-2.5 text-center font-medium"
                        >
                          {ACTION_LABELS[action]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {module.items.map((item) => {
                      const actions = getPermissionItemActions(item)
                      const selected = permissions[item.id] ?? []
                      const hasFullAccess =
                        actions.length > 0 &&
                        actions.every((action) => selected.includes(action))

                      return (
                        <tr
                          key={item.id}
                          className="border-b last:border-b-0 hover:bg-muted/20"
                        >
                          <td className="px-4 py-3 font-medium">{item.label}</td>
                          <td className="px-3 py-3 text-center">
                            <Checkbox
                              className="mx-auto"
                              checked={hasFullAccess}
                              onCheckedChange={(checked) =>
                                toggleRow(item.id, actions, checked)
                              }
                              aria-label={`Full access to ${item.label}`}
                            />
                          </td>
                          {GROUP_PERMISSION_ACTIONS.map((action) => (
                            <td key={action} className="px-3 py-3 text-center">
                              {actions.includes(action) ? (
                                <Checkbox
                                  className="mx-auto"
                                  checked={selected.includes(action)}
                                  onCheckedChange={(checked) =>
                                    togglePermission(item.id, action, checked)
                                  }
                                  aria-label={`${ACTION_LABELS[action]} ${item.label}`}
                                />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
