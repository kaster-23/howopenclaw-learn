import type { MetadataRoute } from "next"
import { execSync } from "child_process"
import { source } from "@/lib/source"
import { SITE_URL } from "@/lib/site-url"
import { i18n } from "@/lib/i18n"

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

function localizedUrl(pagePath: string, lang: string): string {
  if (lang === i18n.defaultLanguage) return `${SITE_URL}${pagePath}`
  return `${SITE_URL}/${lang}${pagePath}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage for each locale
  for (const lang of i18n.languages) {
    entries.push({
      url: localizedUrl("", lang),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          i18n.languages.map((l) => [l, localizedUrl("", l)])
        ),
      },
    })
  }

  // All content pages — English source pages with locale variants
  const pages = source.getPages("en")
  for (const page of pages) {
    const lastModified = page.absolutePath
      ? getGitLastModified(page.absolutePath)
      : new Date()

    for (const lang of i18n.languages) {
      entries.push({
        url: localizedUrl(page.url, lang),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: getPriority(page.url),
        alternates: {
          languages: Object.fromEntries(
            i18n.languages.map((l) => [l, localizedUrl(page.url, l)])
          ),
        },
      })
    }
  }

  return entries
}
