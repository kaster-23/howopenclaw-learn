"use client"

import type * as PageTree from "fumadocs-core/page-tree"
import { useState, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base"
import { useTreePath } from "fumadocs-ui/contexts/tree"
import { usePathname } from "next/navigation"

function getItemOffset(depth: number) {
  if (depth <= 0) return 12
  return 12 + depth * 16
}

// Base classes from fumadocs sidebar.js itemVariants
const itemBase =
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0"
const itemButton =
  "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none"
const itemLink =
  "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors"
const itemHighlight =
  "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:start-2.5"

const descriptions: Record<string, string> = {
  Foundation: "Get set up — install, configure, and send your first message",
  Goals: "Pick a goal and follow a step-by-step path to build something real",
  "Level Up": "Add memory, skills, automation, and always-on deployment",
  Channels: "Connect messaging apps — Slack, Telegram, iMessage, and more",
  Reference: "CLI reference, core concepts, and troubleshooting",
  Compare: "See how OpenClaw stacks up against ChatGPT, n8n, Zapier, and more",
}

export function SidebarFolderWithTooltip({
  item,
  children,
}: {
  item: PageTree.Folder
  children: ReactNode
}) {
  const path = useTreePath()
  const pathname = usePathname()
  const outerDepth = useFolderDepth()
  const active = path.includes(item)
  const name = typeof item.name === "string" ? item.name : ""
  const description = descriptions[name]

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    if (!triggerRef.current || !description) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({ x: rect.right + 10, y: rect.top + rect.height / 2 })
  }

  const padding = getItemOffset(outerDepth)
  const isNested = outerDepth > 0

  return (
    <>
      <SidebarFolder
        active={active}
        defaultOpen={item.defaultOpen}
        collapsible={item.collapsible ?? true}
      >
        <div ref={triggerRef} onMouseEnter={showTooltip} onMouseLeave={() => setPos(null)}>
          {item.index ? (
            <SidebarFolderLink
              href={item.index.url}
              active={
                pathname === item.index.url ||
                pathname.startsWith(`${item.index.url}/`)
              }
              external={item.index.external}
              className={`${itemBase} ${itemLink} ${isNested ? itemHighlight : ""} w-full`}
              style={{ paddingInlineStart: padding }}
            >
              {item.icon}
              {item.name}
            </SidebarFolderLink>
          ) : (
            <SidebarFolderTrigger
              className={`${itemBase} ${itemButton} w-full`}
              style={{ paddingInlineStart: padding }}
            >
              {item.icon}
              {item.name}
            </SidebarFolderTrigger>
          )}
        </div>
        <SidebarFolderContent
          className={
            !isNested
              ? "relative before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5"
              : undefined
          }
        >
          {children}
        </SidebarFolderContent>
      </SidebarFolder>

      {pos &&
        description &&
        createPortal(
          <div
            role="tooltip"
            style={{ left: pos.x, top: pos.y }}
            className="pointer-events-none fixed -translate-y-1/2 z-[9999] w-52 rounded-md bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-sm leading-relaxed px-2.5 py-1.5 shadow-lg"
          >
            <span
              className="absolute top-1/2 -left-1.5 -translate-y-1/2 border-[5px] border-transparent border-r-zinc-900 dark:border-r-zinc-800"
              aria-hidden="true"
            />
            {description}
          </div>,
          document.body
        )}
    </>
  )
}

export function SidebarSeparatorItem(_: { item: unknown }) {
  return (
    <div className="my-1 mx-3 h-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
  )
}
