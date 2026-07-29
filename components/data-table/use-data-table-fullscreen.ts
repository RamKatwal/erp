"use client"

import * as React from "react"

export function useDataTableFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const toggleFullscreen = React.useCallback(() => {
    setIsFullscreen((current) => !current)
  }, [])

  React.useEffect(() => {
    if (!isFullscreen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isFullscreen])

  return { isFullscreen, setIsFullscreen, toggleFullscreen }
}

export function dataTableFullscreenClassName(isFullscreen: boolean) {
  return isFullscreen
    ? "fixed inset-0 z-50 flex flex-col rounded-none border-0 shadow-none"
    : undefined
}
