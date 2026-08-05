export const organizations = [
  {
    id: "abc",
    name: "ABC Company",
    plan: "De-lite Plan",
    initials: "A",
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
