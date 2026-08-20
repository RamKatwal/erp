import type { ReactNode } from "react"

function displayValue(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : "—"
}

export function CompanyDetailField({
  label,
  children,
  value,
}: {
  label: string
  children?: ReactNode
  value?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium wrap-break-word">
        {children ?? displayValue(value)}
      </dd>
    </div>
  )
}
