export const organizations = [
  {
    id: "abc",
    name: "Omniverse",
    plan: "De-lite Plan",
    initials: "O",
    location: "Suryabinayak, Bhaktapur",
    color: "bg-muted text-foreground",
  },
  {
    id: "notion",
    name: "Notion",
    plan: "Enterprise Plan",
    initials: "N",
    location: "Pulchowk, Lalitpur",
    color: "bg-muted text-foreground",
  },
] as const

export type Organization = (typeof organizations)[number]
