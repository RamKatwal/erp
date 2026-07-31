export const organizations = [
  {
    id: "acme",
    name: "Acme Inc",
    plan: "Pro",
    initials: "AC",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "novaco",
    name: "NovaCo",
    plan: "Free",
    initials: "NO",
    color: "bg-info text-info-foreground",
  },
] as const

export type Organization = (typeof organizations)[number]
