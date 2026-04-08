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

function getSection(pathname: string): (SectionData & { key: string }) | null {
  for (const [key, data] of Object.entries(SECTIONS)) {
    if (pathname === `/${key}` || pathname.startsWith(`/${key}/`)) {
      return { key, ...data }
    }
  }
  return null
}

export function SectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const section = getSection(pathname)

  if (!section) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        {children}
      </div>
    )
  }

  const isIndex = pathname === section.indexHref

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-44 shrink-0" aria-label="Section navigation">
          <div className="sticky top-[calc(3.5rem+2rem)] space-y-1">
            <Link
              href={section.indexHref}
              className={`block rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors mb-3 ${
                isIndex
                  ? "text-fd-foreground"
                  : "text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              {section.label}
            </Link>
            {section.pages.map((page) => {
              const isActive = pathname === page.href
              return (
                <Link
                  key={page.href}
                  href={page.href}
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
