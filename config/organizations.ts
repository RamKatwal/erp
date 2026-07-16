export const organizations = [
  {
    id: "acme",
    name: "Acme Inc",
    plan: "Pro",
    initials: "AC",
    color: "bg-violet-600 text-white",
  },
  {
    id: "novaco",
    name: "NovaCo",
    plan: "Free",
    initials: "NO",
    color: "bg-sky-600 text-white",
  },
] as const

export type Organization = (typeof organizations)[number]
