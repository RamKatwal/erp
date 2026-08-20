"use client"

import * as React from "react"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const formDialogSizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
  "2xl": "sm:max-w-3xl",
} as const

type FormDialogSize = keyof typeof formDialogSizes

function FormDialogContent({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof DialogContent> & {
  size?: FormDialogSize
}) {
  return (
    <DialogContent
      className={cn(
        "flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden bg-card p-0 ring-border dark:bg-background sm:max-w-lg",
        formDialogSizes[size],
        className
      )}
      {...props}
    />
  )
}

function FormDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  return (
    <DialogHeader
      className={cn("shrink-0 border-b px-5 py-4 pr-12", className)}
      {...props}
    />
  )
}

function FormDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function FormDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription className={className} {...props} />
}

function FormDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "thin-scrollbar flex flex-col gap-4 overflow-y-auto px-5 py-4",
        className
      )}
      {...props}
    />
  )
}

function FormDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn("shrink-0 border-t px-5 py-4", className)}
      {...props}
    />
  )
}

export {
  FormDialogBody,
  FormDialogContent,
  FormDialogDescription,
  FormDialogFooter,
  FormDialogHeader,
  FormDialogTitle,
}
