import type { MetadataRoute } from "next"
import { source } from "@/lib/source"

const INDEX_SLUGS = new Set([
  "/course",
  "/reference",
  "/channels",
  "/compare",
  "/course/7-projects",
])

function getPriority(url: string): number {
  if (INDEX_SLUGS.has(url)) return 0.9
  return 0.8
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howopenclaw.com"

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...source.getPages().map((page) => ({
      url: `${base}${page.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: getPriority(page.url),
    })),
  ]
}
