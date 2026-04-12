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
  const base = SITE_URL

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...source.getPages().map((page) => {
      const lastModified = page.absolutePath
        ? getGitLastModified(page.absolutePath)
        : new Date()
      return {
        url: `${base}${page.url}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: getPriority(page.url),
      }
    }),
  ]
}
