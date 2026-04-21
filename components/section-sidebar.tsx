"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import type { ReactNode } from "react"

interface SectionPage {
  title: string
  href: string
}

interface SectionData {
  label: string
  indexHref: string
  pages: SectionPage[]
}

const SECTIONS: Record<string, SectionData> = {
  channels: {
    label: "Channels",
    indexHref: "/channels",
    pages: [
      { title: "Choose a Channel", href: "/channels/choosing-a-channel" },
      { title: "Slack", href: "/channels/slack" },
      { title: "Telegram", href: "/channels/telegram" },
      { title: "Discord", href: "/channels/discord" },
      { title: "WhatsApp", href: "/channels/whatsapp" },
      { title: "Signal", href: "/channels/signal" },
      { title: "iMessage", href: "/channels/imessage" },
      { title: "WebChat", href: "/channels/webchat" },
      { title: "Microsoft Teams", href: "/channels/teams" },
    ],
  },
  compare: {
    label: "Compare",
    indexHref: "/compare",
    pages: [
      { title: "vs ChatGPT", href: "/compare/openclaw-vs-chatgpt" },
      { title: "vs Claude Code", href: "/compare/openclaw-vs-claude-code" },
      { title: "vs n8n", href: "/compare/openclaw-vs-n8n" },
      { title: "vs Zapier", href: "/compare/openclaw-vs-zapier" },
      { title: "vs AutoGPT", href: "/compare/openclaw-vs-autogpt" },
      { title: "vs OpenAI Assistants", href: "/compare/openclaw-vs-openai-assistants" },
      { title: "vs Flowise", href: "/compare/openclaw-vs-flowise" },
    ],
  },
  reference: {
    label: "Reference",
    indexHref: "/reference",
    pages: [
      { title: "What is OpenClaw?", href: "/reference/what-is-openclaw" },
      { title: "CLI Cheatsheet", href: "/reference/cli" },
      { title: "Key Concepts", href: "/reference/concepts" },
      { title: "Fix It When It Breaks", href: "/reference/troubleshooting" },
      { title: "Pricing & Cost", href: "/reference/pricing" },
      { title: "System Requirements", href: "/reference/system-requirements" },
    ],
  },
}

const LOCALE_PREFIXES = ["/es", "/pt", "/ja"]

/** Strip locale prefix from pathname for section matching */
function stripLocale(pathname: string): string {
  for (const prefix of LOCALE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/"
    }
  }
  return pathname
}

function getSection(pathname: string): (SectionData & { key: string }) | null {
  const bare = stripLocale(pathname)
  for (const [key, data] of Object.entries(SECTIONS)) {
    if (bare === `/${key}` || bare.startsWith(`/${key}/`)) {
      return { key, ...data }
    }
  }
  return null
}

/** Get the locale prefix from pathname (empty string for English) */
function getLocalePrefix(pathname: string): string {
  for (const prefix of LOCALE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return prefix
    }
  }
  return ""
}

export function SectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const section = getSection(pathname)
  const localePrefix = getLocalePrefix(pathname)

  if (!section) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        {children}
      </div>
    )
  }

  const barePath = stripLocale(pathname)
  const isIndex = barePath === section.indexHref

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-44 shrink-0" aria-label="Section navigation">
          <div className="sticky top-[calc(3.5rem+2rem)] space-y-1">
            <Link
              href={`${localePrefix}${section.indexHref}`}
              className={`block rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors mb-3 ${
                isIndex
                  ? "text-fd-foreground"
                  : "text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              {section.label}
            </Link>
            {section.pages.map((page) => {
              const isActive = barePath === page.href
              return (
                <Link
                  key={page.href}
                  href={`${localePrefix}${page.href}`}
                  className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--color-fd-primary)]/10 text-[var(--color-fd-primary)] font-medium"
                      : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
                  }`}
                >
                  {page.title}
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
