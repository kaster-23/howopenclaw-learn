import { i18n, LOCALE_TO_LANG, LOCALE_TO_OG } from "@/lib/i18n"

const SITE_URL = "https://www.howopenclaw.com"

/** Build the public URL for a page in a given locale */
export function localizedUrl(slug: string[], lang: string): string {
  const path = slug.length > 0 ? `/${slug.join("/")}` : ""
  if (lang === i18n.defaultLanguage) return `${SITE_URL}${path}`
  return `${SITE_URL}/${lang}${path}`
}

/** Build hreflang alternates object for Next.js metadata */
export function hreflangAlternates(slug: string[]): Record<string, string> {
  const alts: Record<string, string> = {}
  for (const lang of i18n.languages) {
    alts[lang] = localizedUrl(slug, lang)
  }
  alts["x-default"] = localizedUrl(slug, i18n.defaultLanguage)
  return alts
}

/** Get BCP-47 language tag for JSON-LD inLanguage */
export function inLanguage(lang: string): string {
  return LOCALE_TO_LANG[lang] ?? "en-US"
}

/** Get OpenGraph locale string */
export function ogLocale(lang: string): string {
  return LOCALE_TO_OG[lang] ?? "en_US"
}

export { SITE_URL }
