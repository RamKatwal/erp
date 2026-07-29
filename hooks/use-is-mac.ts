"use client"

import * as React from "react"

import { isMacPlatform } from "@/lib/keyboard/utils"

export function useIsMac() {
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(isMacPlatform())
  }, [])

  return isMac
}
