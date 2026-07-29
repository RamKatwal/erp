"use client"

import * as React from "react"

export type HomeLayoutActions = {
  canEdit: boolean
  isLayoutEditing: boolean
  hasCustomLayout: boolean
  startEditing: () => void
  resetLayout: () => void
}

type HomeViewContextValue = {
  isFullscreen: boolean
  expandToFullscreen: () => void
  exitFullscreen: () => void
  layoutActions: HomeLayoutActions | null
  registerLayoutActions: (actions: HomeLayoutActions | null) => void
}

const HomeViewContext = React.createContext<HomeViewContextValue | null>(null)

export function HomeViewProvider({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [layoutActions, setLayoutActions] =
    React.useState<HomeLayoutActions | null>(null)

  const expandToFullscreen = React.useCallback(() => {
    setIsFullscreen(true)
  }, [])

  const exitFullscreen = React.useCallback(() => {
    setIsFullscreen(false)
  }, [])

  const registerLayoutActions = React.useCallback(
    (actions: HomeLayoutActions | null) => {
      setLayoutActions(actions)
    },
    []
  )

  const value = React.useMemo(
    () => ({
      isFullscreen,
      expandToFullscreen,
      exitFullscreen,
      layoutActions,
      registerLayoutActions,
    }),
    [
      isFullscreen,
      expandToFullscreen,
      exitFullscreen,
      layoutActions,
      registerLayoutActions,
    ]
  )

  return (
    <HomeViewContext.Provider value={value}>{children}</HomeViewContext.Provider>
  )
}

export function useHomeView() {
  const context = React.useContext(HomeViewContext)
  if (!context) {
    throw new Error("useHomeView must be used within HomeViewProvider")
  }
  return context
}

/** Optional hook for components that may render outside the home shell. */
export function useHomeViewOptional() {
  return React.useContext(HomeViewContext)
}
