import type { MetadataRoute } from "next"
import { execSync } from "child_process"
import { source } from "@/lib/source"
import { SITE_URL } from "@/lib/site-url"

const INDEX_SLUGS = new Set([
  "/course",
  "/reference",
  "/channels",
  "/compare",
])

function getPriority(url: string): number {
  if (INDEX_SLUGS.has(url)) return 0.9
  return 0.8
}

function getGitLastModified(filePath: string): Date {
  try {
    const iso = execSync(
      `git log -1 --format="%aI" -- "${filePath}"`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
    ).trim()
    if (iso) return new Date(iso)
  } catch { /* fall through */ }
  return new Date()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ]

  for (const page of source.getPages()) {
    const lastModified = page.absolutePath
      ? getGitLastModified(page.absolutePath)
      : new Date()

    entries.push({
      url: `${SITE_URL}${page.url}`,
      lastModified,
      changeFrequency: "weekly",
      priority: getPriority(page.url),
    })
  }

  return entries
}
