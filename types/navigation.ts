import type { ComponentType, SVGProps } from "react"

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>

export type NavItem = {
  title: string
  href: string
  icon: NavIcon
  description?: string
  children?: NavItem[]
}
