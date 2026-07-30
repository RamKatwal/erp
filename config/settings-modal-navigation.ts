import {
  Bell,
  Keyboard,
  Palette,
  ScrollText,
  User,
  type LucideIcon,
} from "lucide-react"

export type SettingsModalSection =
  | "profile"
  | "notifications"
  | "appearance"
  | "keyboard-shortcuts"
  | "user-activities"

export type SettingsModalNavItem = {
  id: SettingsModalSection
  title: string
  description: string
  icon: LucideIcon
}

export const settingsModalNavigation: SettingsModalNavItem[] = [
  {
    id: "profile",
    title: "Profile",
    description: "Manage your account identity.",
    icon: User,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configure email and in-app notification preferences.",
    icon: Bell,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize theme color and font across the workspace.",
    icon: Palette,
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description: "Browse and search every shortcut available across the workspace.",
    icon: Keyboard,
  },
  {
    id: "user-activities",
    title: "User Activities",
    description: "Review recent user activity and audit logs.",
    icon: ScrollText,
  },
]

export function getSettingsModalItem(section: SettingsModalSection) {
  return settingsModalNavigation.find((item) => item.id === section)
}
