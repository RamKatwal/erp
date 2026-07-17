import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "ABC Company",
  description: "Enterprise resource planning dashboard",
  icons: {
    icon: "/abc-company-logo.png",
    apple: "/abc-company-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className={cn("flex min-h-full flex-col font-sans", GeistSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
