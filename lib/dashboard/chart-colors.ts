/**
 * Chart color tokens (BoardUI Graphs + extras).
 * @see https://www.boardui.com/components/color
 *
 * Prefer var(--chart-N) for Recharts fill/stroke — these resolve from :root.
 * Use bg-chart-N for HTML swatches.
 *
 * 1–8  BoardUI categorical ramp (teal → yellow)
 * 9–12 Extra accents (orange, rose, cyan, indigo)
 * track / cursor / neutral — UI chrome only (grays)
 */

export type ChartAccent = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/** Full categorical ramp for multi-series charts */
export const CHART_ACCENTS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const satisfies readonly ChartAccent[]

/**
 * Concrete color for ChartConfig / Recharts.
 * Uses :root --chart-* tokens (not --color-chart-*), so SVG fills always resolve.
 */
export function chartColor(accent: ChartAccent, active = false) {
  return active ? `var(--chart-${accent}-active)` : `var(--chart-${accent})`
}

export function chartColorClass(accent: ChartAccent, active = false) {
  return active ? `bg-chart-${accent}-active` : `bg-chart-${accent}`
}

/** Pick accent by series index (wraps at 12). */
export function chartColorByIndex(index: number, active = false) {
  const accent = CHART_ACCENTS[index % CHART_ACCENTS.length]!
  return chartColor(accent, active)
}

export const chartUiTokens = {
  track: "var(--chart-track)",
  cursor: "var(--chart-cursor)",
  neutral: "var(--chart-neutral)",
  agentsBar: "var(--chart-agents-bar)",
  agentsBarActive: "var(--chart-agents-bar-active)",
} as const
