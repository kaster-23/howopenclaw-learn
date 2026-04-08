import { source } from "@/lib/source"
import { NextResponse } from "next/server"

export const dynamic = "force-static"

const SECTION_ORDER = ["course", "reference", "channels", "compare"]
const SECTION_LABELS: Record<string, string> = {
  course: "Course",
  reference: "Reference",
  channels: "Channels",
  compare: "Compare",
}

export function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howopenclaw.com").trim().replace(/\/$/, "").replace("://howopenclaw.com", "://www.howopenclaw.com")
  const pages = source.getPages()

  // Group pages by top-level section
  const sections: Record<string, typeof pages> = {}
  for (const page of pages) {
    const section = page.url.split("/")[1]
    if (!section) continue
    if (!sections[section]) sections[section] = []
    sections[section].push(page)
  }

  const lines: string[] = [
    "# HowOpenClaw",
    "",
    "> Community documentation for OpenClaw — the open-source self-hosted AI assistant.",
    "> Practical guides for installation, configuration, channels, automation, and more.",
    "",
    `- Homepage: ${base}`,
    `- Sitemap: ${base}/sitemap.xml`,
    "",
  ]

  for (const section of SECTION_ORDER) {
    const sectionPages = sections[section]
    if (!sectionPages?.length) continue

    lines.push(`## ${SECTION_LABELS[section] ?? section}`)
    lines.push("")

    const sorted = [...sectionPages].sort((a, b) => a.url.localeCompare(b.url))
    for (const page of sorted) {
      const desc = page.data.description ? `: ${page.data.description}` : ""
      lines.push(`- [${page.data.title}](${base}${page.url})${desc}`)
    }
    lines.push("")
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
