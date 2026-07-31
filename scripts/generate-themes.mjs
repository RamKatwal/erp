import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const themes = [
  { id: "red", hue: 25, L: "0.55 0.22", D: "0.70 0.18", R: "0.60 0.22" },
  { id: "orange", hue: 45, L: "0.65 0.19", D: "0.75 0.16", R: "0.70 0.18" },
  { id: "amber", hue: 75, L: "0.72 0.16", D: "0.80 0.14", R: "0.75 0.15", lightFg: "dark" },
  { id: "yellow", hue: 95, L: "0.80 0.16", D: "0.86 0.14", R: "0.82 0.15", lightFg: "dark" },
  { id: "neon", hue: 130, L: "0.75 0.22", D: "0.84 0.20", R: "0.78 0.20", lightFg: "dark" },
  { id: "green", hue: 145, L: "0.55 0.17", D: "0.75 0.18", R: "0.62 0.17" },
  { id: "emerald", hue: 160, L: "0.55 0.14", D: "0.75 0.15", R: "0.62 0.14" },
  { id: "teal", hue: 180, L: "0.52 0.10", D: "0.77 0.12", R: "0.60 0.11" },
  { id: "cyan", hue: 200, L: "0.60 0.12", D: "0.78 0.12", R: "0.65 0.12" },
  { id: "light-blue", hue: 230, L: "0.62 0.14", D: "0.76 0.12", R: "0.68 0.13" },
  { id: "blue", hue: 255, L: "0.52 0.22", D: "0.70 0.16", R: "0.58 0.20" },
  { id: "violet-blue", hue: 264, L: "0.49 0.24", D: "0.71 0.16", R: "0.55 0.24" },
  { id: "purple", hue: 300, L: "0.50 0.24", D: "0.72 0.18", R: "0.55 0.24" },
  { id: "dark-orchid", hue: 315, L: "0.52 0.24", D: "0.72 0.18", R: "0.58 0.22" },
  { id: "fuchsia", hue: 330, L: "0.55 0.26", D: "0.74 0.20", R: "0.60 0.24" },
  { id: "magenta", hue: 350, L: "0.55 0.24", D: "0.72 0.18", R: "0.60 0.22" },
  { id: "rose", hue: 15, L: "0.55 0.22", D: "0.71 0.18", R: "0.60 0.22" },
]

function lightBlock(t) {
  const h = t.hue
  const primaryFg =
    t.lightFg === "dark" ? `oklch(0.25 0.05 ${h})` : "oklch(0.985 0 0)"
  return `html[data-theme-color="${t.id}"] {
  --background: oklch(0.97 0.012 ${h});
  --foreground: oklch(0.145 0.02 ${h});
  --card: oklch(1 0.006 ${h});
  --card-foreground: oklch(0.145 0.02 ${h});
  --popover: oklch(1 0.006 ${h});
  --popover-foreground: oklch(0.145 0.02 ${h});
  --primary: oklch(${t.L} ${h});
  --primary-foreground: ${primaryFg};
  --secondary: oklch(0.95 0.025 ${h});
  --secondary-foreground: oklch(0.3 0.06 ${h});
  --muted: oklch(0.95 0.018 ${h});
  --muted-foreground: oklch(0.5 0.03 ${h});
  --accent: oklch(0.94 0.04 ${h});
  --accent-foreground: oklch(0.38 0.12 ${h});
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.9 0.025 ${h});
  --input: oklch(0.9 0.025 ${h});
  --ring: oklch(${t.R} ${h});
  --sidebar: oklch(0.995 0.01 ${h});
  --sidebar-foreground: oklch(0.25 0.03 ${h});
  --sidebar-primary: oklch(${t.L} ${h});
  --sidebar-primary-foreground: ${primaryFg};
  --sidebar-accent: oklch(0.94 0.045 ${h});
  --sidebar-accent-foreground: oklch(0.38 0.12 ${h});
  --sidebar-border: oklch(0.9 0.025 ${h});
  --sidebar-ring: oklch(${t.R} ${h});
  --chart-agents-bar: oklch(0.8 0.1 ${h});
  --chart-agents-bar-active: oklch(0.55 0.16 ${h});
  --trial-accent: oklch(${t.L} ${h});
  --trial-surface: oklch(1 0.006 ${h});
  --trial-glow: color-mix(in oklch, var(--trial-accent) 8%, var(--trial-surface));
}`
}

function darkBlock(t) {
  const h = t.hue
  return `html.dark[data-theme-color="${t.id}"] {
  --background: oklch(0.145 0.015 ${h});
  --foreground: oklch(0.985 0.01 ${h});
  --card: oklch(0.2 0.02 ${h});
  --card-foreground: oklch(0.985 0.01 ${h});
  --popover: oklch(0.2 0.02 ${h});
  --popover-foreground: oklch(0.985 0.01 ${h});
  --primary: oklch(${t.D} ${h});
  --primary-foreground: oklch(0.2 0.04 ${h});
  --secondary: oklch(0.27 0.03 ${h});
  --secondary-foreground: oklch(0.985 0.01 ${h});
  --muted: oklch(0.27 0.025 ${h});
  --muted-foreground: oklch(0.7 0.03 ${h});
  --accent: oklch(0.28 0.05 ${h});
  --accent-foreground: oklch(0.82 0.1 ${h});
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(${t.R} ${h});
  --sidebar: oklch(0.19 0.025 ${h});
  --sidebar-foreground: oklch(0.985 0.01 ${h});
  --sidebar-primary: oklch(${t.D} ${h});
  --sidebar-primary-foreground: oklch(0.2 0.04 ${h});
  --sidebar-accent: oklch(0.28 0.05 ${h});
  --sidebar-accent-foreground: oklch(0.85 0.1 ${h});
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(${t.R} ${h});
  --chart-agents-bar: oklch(0.55 0.16 ${h});
  --chart-agents-bar-active: oklch(0.68 0.16 ${h});
  --trial-accent: oklch(${t.D} ${h});
  --trial-surface: var(--background);
  --trial-glow: color-mix(in oklch, var(--trial-accent) 16%, var(--trial-surface));
}`
}

const base = `/*
 * Semantic color themes — complete shadcn token sets.
 * Base (:root / .dark) = Gray (default, no data-theme-color).
 * Brand themes: html[data-theme-color="…"] + html.dark[data-theme-color="…"].
 * Chart categorical series stay on base so data stays distinguishable.
 */

/* -------------------------------------------------------------------------- */
/* Base — Gray (light)                                                        */
/* -------------------------------------------------------------------------- */

:root {
  --background: oklch(0.97 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Status (theme-agnostic) */
  --success: oklch(0.55 0.15 163);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.7 0.15 85);
  --warning-foreground: oklch(0.25 0.05 85);
  --info: oklch(0.6 0.14 230);
  --info-foreground: oklch(0.985 0 0);

  /* Chart UI chrome (neutral only) */
  --chart-track: oklch(92.2% 0 0);
  --chart-cursor: oklch(87% 0 0);
  --chart-neutral: oklch(87% 0 0);
  --chart-1: oklch(77.7% 0.152 181.912);
  --chart-1-active: oklch(70.4% 0.14 182.503);
  --chart-2: oklch(84.1% 0.238 128.85);
  --chart-2-active: oklch(76.8% 0.233 130.85);
  --chart-3: oklch(71.8% 0.202 349.761);
  --chart-3-active: oklch(65.6% 0.241 354.308);
  --chart-4: oklch(74.6% 0.16 232.661);
  --chart-4-active: oklch(68.5% 0.169 237.323);
  --chart-5: oklch(71.4% 0.203 305.504);
  --chart-5-active: oklch(62.7% 0.265 303.9);
  --chart-6: oklch(70.7% 0.165 254.624);
  --chart-6-active: oklch(62.3% 0.214 259.815);
  --chart-7: oklch(76.5% 0.177 163.223);
  --chart-7-active: oklch(69.6% 0.17 162.48);
  --chart-8: oklch(85.2% 0.199 91.936);
  --chart-8-active: oklch(79.5% 0.184 86.047);
  --chart-9: oklch(75% 0.183 55.934);
  --chart-9-active: oklch(70.5% 0.213 47.604);
  --chart-10: oklch(71.2% 0.194 13.428);
  --chart-10-active: oklch(64.5% 0.246 16.439);
  --chart-11: oklch(78.9% 0.154 211.53);
  --chart-11-active: oklch(71.5% 0.143 215.221);
  --chart-12: oklch(67.3% 0.182 276.935);
  --chart-12-active: oklch(58.5% 0.233 277.117);
  --chart-agents-bar: oklch(82.7% 0.119 306.383);
  --chart-agents-bar-active: oklch(71.4% 0.203 305.504);
  --trial-accent: oklch(62.7% 0.265 303.9);
  --trial-surface: oklch(1 0 0);
  --trial-glow: color-mix(in oklch, var(--trial-accent) 8%, var(--trial-surface));

  --radius: 0.625rem;

  --sidebar: oklch(1 0 0);
  --sidebar-foreground: oklch(0.25 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.965 0 0);
  --sidebar-accent-foreground: oklch(0.145 0 0);
  --sidebar-border: oklch(0.92 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

/* -------------------------------------------------------------------------- */
/* Base — Gray (dark)                                                         */
/* -------------------------------------------------------------------------- */

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);

  --success: oklch(0.72 0.15 163);
  --success-foreground: oklch(0.2 0.04 163);
  --warning: oklch(0.8 0.14 85);
  --warning-foreground: oklch(0.25 0.05 85);
  --info: oklch(0.75 0.12 230);
  --info-foreground: oklch(0.2 0.04 230);

  --chart-track: oklch(26.9% 0 0);
  --chart-cursor: oklch(37.1% 0 0);
  --chart-neutral: oklch(26.9% 0 0);
  --chart-agents-bar: oklch(62.7% 0.265 303.9);
  --chart-agents-bar-active: oklch(55.8% 0.288 302.321);
  --trial-accent: oklch(71.4% 0.203 305.504);
  --trial-surface: var(--background);
  --trial-glow: color-mix(in oklch, var(--trial-accent) 16%, var(--trial-surface));

  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
`

const others = themes
const blocks = others
  .map(
    (t) =>
      `/* -------------------------------------------------------------------------- */
/* ${t.id}                                                                    */
/* -------------------------------------------------------------------------- */

${lightBlock(t)}

${darkBlock(t)}`
  )
  .join("\n\n")

const out = path.join(__dirname, "..", "styles", "themes.css")
fs.writeFileSync(out, `${base}\n${blocks}\n`)
console.log(`Wrote gray base + ${themes.length} color themes to ${out}`)
