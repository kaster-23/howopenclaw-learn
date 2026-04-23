import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { source } from "@/lib/source"
import Image from "next/image"
import type { ReactNode } from "react"
import { SidebarFolderWithTooltip, SidebarSeparatorItem } from "@/components/sidebar-folder"
import { SidebarFooterLinks } from "@/components/sidebar-footer-links"
import { SidebarBanner } from "@/components/sidebar-banner"
import { OPENCLAW_VERSION } from "@/lib/openclaw-version"

export default function CourseLayout({
  children,
}: {
  children: ReactNode
}) {
  const version = OPENCLAW_VERSION

  return (
    <>
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
          banner: <SidebarBanner />,
          footer: <SidebarFooterLinks />,
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
    </>
  )
}
