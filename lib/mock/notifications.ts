import type { AppNotification } from "@/types/notification"

export const sampleNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Sarah Chen created a new deal Globex",
    description: "Globex — Enterprise Rollout - $240,000",
    timestamp: "2 min ago",
    read: false,
    actor: {
      name: "Sarah Chen",
      initials: "SC",
      color: "bg-amber-100 text-amber-800",
    },
  },
  {
    id: "n2",
    title: "Deal at risk",
    description:
      "Meridian Bank — Compliance Add-on has stalled in Negotiation for 21 days.",
    timestamp: "15 min ago",
    read: false,
    icon: "trend",
    badges: [{ label: "Urgent", tone: "urgent" }],
    actions: [
      { id: "reassign", label: "Reassign", variant: "primary" },
      { id: "dismiss", label: "Dismiss", variant: "secondary" },
    ],
  },
  {
    id: "n3",
    title: "Marcus Rivera logged a call with Cobalt Health",
    description: "Budget approved for the pilot expansion. Sending the quote today.",
    timestamp: "1 hour ago",
    read: false,
    actor: {
      name: "Marcus Rivera",
      initials: "MR",
      color: "bg-sky-100 text-sky-800",
    },
    rich: { type: "rating", value: 5 },
  },
  {
    id: "n4",
    title: "Pending approval",
    description:
      "Bulk discount campaign for Q2 requires your approval before going live.",
    timestamp: "2 hours ago",
    read: false,
    icon: "check",
    badges: [
      { label: "Priority", tone: "priority" },
      { label: "High", tone: "priority" },
    ],
    actions: [
      { id: "approve", label: "Approve", variant: "primary" },
      { id: "review", label: "Review", variant: "secondary" },
    ],
  },
  {
    id: "n5",
    title: "3 new reps joined your team",
    description: "Sarah, James and Priya have been added to the Enterprise pod.",
    timestamp: "4 hours ago",
    read: true,
    icon: "users",
    rich: {
      type: "avatars",
      people: [
        {
          name: "Sarah Chen",
          initials: "SC",
          color: "bg-amber-100 text-amber-800",
        },
        {
          name: "James Park",
          initials: "JP",
          color: "bg-violet-100 text-violet-800",
        },
        {
          name: "Priya Nair",
          initials: "PN",
          color: "bg-rose-100 text-rose-800",
        },
      ],
    },
  },
  {
    id: "n6",
    title: "Quota milestone reached!",
    description: "$1M closed-won this quarter. Keep up the great work!",
    timestamp: "5 hours ago",
    read: true,
    icon: "star",
    badges: [
      { label: "Goal", tone: "success" },
      { label: "500 orders", tone: "success" },
    ],
    rich: { type: "progress", value: 92 },
  },
  {
    id: "n7",
    title: "QBR reminder",
    description: "Quarterly business review with Globex.",
    timestamp: "8 hours ago",
    read: true,
    icon: "calendar",
    actions: [
      { id: "join", label: "Join", variant: "primary" },
      { id: "decline", label: "Decline", variant: "secondary" },
    ],
    rich: {
      type: "event",
      dateLabel: "Mar 10, 2026",
      timeLabel: "2:00 to 3:00 PM",
      locationLabel: "Google Meet",
      locationHref: "https://meet.google.com",
    },
  },
  {
    id: "n8",
    title: "Invoice INV-2091 is overdue",
    description: "Payment from Cobalt Health is 5 days past due — $18,400.",
    timestamp: "Yesterday",
    read: true,
    icon: "trend",
    badges: [{ label: "Urgent", tone: "urgent" }],
    actions: [
      { id: "remind", label: "Send reminder", variant: "primary" },
      { id: "dismiss", label: "Dismiss", variant: "secondary" },
    ],
  },
]
