"use client"

import type { ReactNode } from "react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"

import {
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  collapseVariants,
  staggerDelay,
  staggerItemVariants,
  transitions,
  withReducedMotion,
} from "@/lib/motion"

type SidebarSubmenuPanelProps = {
  open: boolean
  panelKey: string
  children: ReactNode
}

export function SidebarSubmenuPanel({
  open,
  panelKey,
  children,
}: SidebarSubmenuPanelProps) {
  const reduceMotion = useReducedMotion()
  const transition = withReducedMotion(transitions.normal, reduceMotion)

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <m.div
          key={panelKey}
          variants={collapseVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="overflow-hidden"
        >
          <SidebarMenuSub>{children}</SidebarMenuSub>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}

type SidebarSubmenuItemProps = {
  index: number
  children: ReactNode
}

export function SidebarSubmenuItem({ index, children }: SidebarSubmenuItemProps) {
  const reduceMotion = useReducedMotion()

  return (
    <SidebarMenuSubItem>
      <m.div
        variants={staggerItemVariants}
        initial="initial"
        animate="animate"
        transition={{
          ...withReducedMotion(transitions.normal, reduceMotion),
          delay: staggerDelay(index, reduceMotion),
        }}
      >
        {children}
      </m.div>
    </SidebarMenuSubItem>
  )
}
