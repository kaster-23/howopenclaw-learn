import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { source } from "@/lib/source"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

const levels = [
  { n: "1", label: "Foundation", sub: "Get set up", href: "/foundation" },
  { n: "2", label: "Goals", sub: "Build something", href: "/goals" },
  { n: "3", label: "Level Up", sub: "Go further", href: "/level-up" },
]

function SidebarBanner() {
  return (
    <div className="mx-2 mb-2 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {levels.map((level) => (
        <Link
          key={level.n}
          href={level.href}
          className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
        >
          <span className="w-5 h-5 rounded bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 text-[var(--color-fd-primary)] flex items-center justify-center text-[10px] font-bold shrink-0">
            {level.n}
          </span>
          <div>
            <div className="font-medium text-zinc-800 dark:text-zinc-200 leading-none mb-0.5">{level.label}</div>
            <div className="text-zinc-400 dark:text-zinc-500">{level.sub}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Image src="/clawlogo.png" alt="" width={20} height={20} />
            ClawDocs
          </span>
        ),
      }}
      githubUrl="https://github.com/OpenClaw"
      sidebar={{ defaultOpenLevel: 0, banner: <SidebarBanner /> }}
    >
      <div id="main-content" style={{ display: "contents" }}>
        {children}
      </div>
    </DocsLayout>
  )
}
