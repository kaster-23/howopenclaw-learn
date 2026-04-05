import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { source } from "@/lib/source"
import Image from "next/image"
import type { ReactNode } from "react"
import {
  SidebarFolderWithTooltip,
  SidebarSeparatorItem,
} from "@/components/sidebar-folder"

async function getLatestVersion(): Promise<string> {
  try {
    const res = await fetch("https://api.github.com/repos/OpenClaw/OpenClaw/releases/latest", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return "latest"
    const data = await res.json()
    return (data.tag_name as string) ?? "latest"
  } catch {
    return "latest"
  }
}

export default async function Layout({ children }: { children: ReactNode }) {
  const version = await getLatestVersion()

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <Image src="/clawlogo.png" alt="" width={20} height={20} />
            HowOpenClaw
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              {version}
            </span>
          </span>
        ),
      }}
      githubUrl="https://github.com/OpenClaw"
      sidebar={{
        defaultOpenLevel: 1,
        components: {
          Folder: SidebarFolderWithTooltip,
          Separator: SidebarSeparatorItem,
        },
      }}
    >
      <div id="main-content" style={{ display: "contents" }}>
        {children}
      </div>
    </DocsLayout>
  )
}
