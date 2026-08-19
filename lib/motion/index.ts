import type { Transition, Variants } from "framer-motion"

export const easings = {
  standard: [0.4, 0, 0.2, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
}

export const durations = {
  fast: 0.15,
  normal: 0.22,
  slow: 0.3,
}

export const transitions = {
  fast: {
    duration: durations.fast,
    ease: easings.standard,
  },
  normal: {
    duration: durations.normal,
    ease: easings.standard,
  },
  panel: {
    duration: durations.normal,
    ease: easings.decelerate,
  },
  spring: {
    type: "spring" as const,
    stiffness: 420,
    damping: 36,
    mass: 0.9,
  },
  none: {
    duration: 0,
  },
}

export function withReducedMotion<T extends Transition>(
  transition: T,
  reduceMotion: boolean | null
): T | { duration: 0 } {
  if (reduceMotion) {
    return { duration: 0 }
  }

  return transition
}

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const dialogVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export function sheetSlideVariants(
  side: "top" | "right" | "bottom" | "left"
): Variants {
  const offset = 20

  const initialBySide = {
    top: { y: -offset, opacity: 0 },
    bottom: { y: offset, opacity: 0 },
    left: { x: -offset, opacity: 0 },
    right: { x: offset, opacity: 0 },
  } as const

  return {
    initial: initialBySide[side],
    animate: { x: 0, y: 0, opacity: 1 },
    exit: initialBySide[side],
  }
}

export const collapseVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0 },
}

export function staggerDelay(index: number, reduceMotion: boolean | null) {
  if (reduceMotion) {
    return 0
  }

  return index * 0.03
}
