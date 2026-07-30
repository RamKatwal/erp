export type NotificationBadgeTone =
  | "urgent"
  | "priority"
  | "success"
  | "neutral"

export type NotificationBadge = {
  label: string
  tone: NotificationBadgeTone
}

export type NotificationActionVariant = "primary" | "secondary"

export type NotificationAction = {
  id: string
  label: string
  variant: NotificationActionVariant
}

export type NotificationActor = {
  name: string
  initials: string
  avatarUrl?: string
  color?: string
}

export type NotificationIconKind =
  | "trend"
  | "check"
  | "users"
  | "star"
  | "calendar"

export type NotificationRichContent =
  | { type: "rating"; value: number; max?: number }
  | { type: "avatars"; people: NotificationActor[] }
  | { type: "progress"; value: number; max?: number }
  | {
      type: "event"
      dateLabel: string
      timeLabel: string
      locationLabel?: string
      locationHref?: string
    }

export type AppNotification = {
  id: string
  title: string
  description?: string
  timestamp: string
  read: boolean
  actor?: NotificationActor
  icon?: NotificationIconKind
  badges?: NotificationBadge[]
  actions?: NotificationAction[]
  rich?: NotificationRichContent
}
