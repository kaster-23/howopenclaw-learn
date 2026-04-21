import { source } from "@/lib/source"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { FaqSection } from "@/components/faq-section"
import { OpenClawVersion } from "@/components/openclaw-version"
import { execSync } from "child_process"
import { Callout } from "fumadocs-ui/components/callout"
import { Steps, Step } from "fumadocs-ui/components/steps"
import { Card, Cards } from "fumadocs-ui/components/card"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { Mermaid } from "@/components/mdx/mermaid"
import { Table } from "@/components/mdx/table"
import { notFound } from "next/navigation"
import { hreflangAlternates, inLanguage, localizedUrl, ogLocale, SITE_URL } from "@/lib/i18n-url"

import {
  ArrowRightLeft,
  BarChart2,
  Bell,
  BookMarked,
  CircleDollarSign,
  Monitor,
  BookOpen,
  Brain,
  Briefcase,
  CheckSquare,
  Clock,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Globe,
  Hash,
  Heart,
  Home,
  Layers,
  MessageCircle,
  MessageSquare,
  Mic,
  Package,
  RefreshCw,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Timer,
  TrendingUp,
  User,
  Volume2,
  Wrench,
} from "lucide-react"

import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const page = source.getPage(slug, lang)
  if (!page) return {}

  const pageTitle = `${page.data.title} – HowOpenClaw`
  const description =
    page.data.description ??
    "Community documentation for OpenClaw — the open-source self-hosted AI assistant."

  return {
    title: page.data.title,
    description,
    authors: [{ name: "HowOpenClaw Community", url: SITE_URL }],
    openGraph: {
      title: pageTitle,
      description,
      url: localizedUrl(slug, lang),
      type: "article",
      siteName: "HowOpenClaw",
      locale: ogLocale(lang),
      images: [{ url: "/og-image.png", width: 2414, height: 1274, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: "@imfrancoierace",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: localizedUrl(slug, lang),
      languages: hreflangAlternates(slug),
    },
  }
}

function buildBreadcrumbList(slug: string[], lang: string, pageTitle: string) {
  const items: { "@type": string; position: number; name: string; item: string }[] = [
    { "@type": "ListItem", position: 1, name: "HowOpenClaw", item: SITE_URL },
  ]
  let pos = 2
  for (let i = 0; i < slug.length - 1; i++) {
    const parent = source.getPage(slug.slice(0, i + 1), lang)
    const name =
      parent?.data.title ??
      slug[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    items.push({
      "@type": "ListItem",
      position: pos++,
      name,
      item: localizedUrl(slug.slice(0, i + 1), lang),
    })
  }
  items.push({
    "@type": "ListItem",
    position: pos,
    name: pageTitle,
    item: localizedUrl(slug, lang),
  })
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items }
}

const mdxComponents = {
  ...defaultMdxComponents,
  Callout,
  Steps,
  Step,
  Card,
  Cards,
  Tab,
  OpenClawVersion,
  Tabs,
  Mermaid,
  table: Table,
  ArrowRightLeft,
  BarChart2,
  Bell,
  BookMarked,
  BookOpen,
  CircleDollarSign,
  Monitor,
  Brain,
  Briefcase,
  CheckSquare,
  Clock,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Globe,
  Hash,
  Heart,
  Home,
  Layers,
  MessageCircle,
  MessageSquare,
  Mic,
  Package,
  RefreshCw,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Timer,
  TrendingUp,
  User,
  Volume2,
  Wrench,
}

function getGitDate(filePath: string): string {
  try {
    const iso = execSync(
      `git log -1 --format="%aI" -- "${filePath}"`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
    ).trim()
    if (iso) return new Date(iso).toISOString().split("T")[0]
  } catch { /* fall through */ }
  return new Date().toISOString().split("T")[0]
}

export default async function Page({ params }: PageProps) {
  const { slug, lang } = await params
  const page = source.getPage(slug, lang)
  if (!page) notFound()

  const MDX = page.data.body

  const dateModified = page.absolutePath ? getGitDate(page.absolutePath) : new Date().toISOString().split("T")[0]
  const pageUrl = localizedUrl(slug, lang)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${pageUrl}#article`,
    headline: page.data.title,
    description: page.data.description,
    url: pageUrl,
    datePublished: "2025-03-01",
    dateModified,
    inLanguage: inLanguage(lang),
    ...(page.data.readTime ? { timeRequired: `PT${page.data.readTime}M` } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "HowOpenClaw",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/clawlogo.png` },
    },
    author: {
      "@type": "Organization",
      name: "HowOpenClaw Community",
      url: SITE_URL,
    },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "HowOpenClaw", url: SITE_URL },
    about: {
      "@type": "SoftwareApplication",
      "@id": "https://openclaw.ai/#app",
      name: "OpenClaw",
      sameAs: "https://openclaw.ai",
    },
    mentions: [
      { "@type": "SoftwareApplication", name: "OpenClaw", sameAs: "https://openclaw.ai" },
      { "@type": "SoftwareApplication", name: "Telegram", sameAs: "https://telegram.org" },
      { "@type": "SoftwareApplication", name: "Ollama", sameAs: "https://ollama.ai" },
      { "@type": "Organization", name: "Anthropic", sameAs: "https://anthropic.com" },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".prose > p:first-of-type"],
    },
  }

  const breadcrumbJsonLd = buildBreadcrumbList(slug, lang, page.data.title)

  const stripLinks = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

  const faqJsonLd = page.data.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.data.faqs.map(({ q, a }: { q: string; a: string }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: stripLinks(a) },
        })),
      }
    : null

  const howToJsonLd = page.data.howToSteps?.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: page.data.title,
        description: page.data.description,
        step: page.data.howToSteps.map((text: string, i: number) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}

      <article>
        <header className="mb-10 pb-8 border-b border-fd-border">
          <h1 className="text-3xl font-bold tracking-tight text-fd-foreground mb-3">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="text-lg text-fd-muted-foreground leading-relaxed max-w-2xl">
              {page.data.description}
            </p>
          )}
        </header>
        <div className="prose dark:prose-invert max-w-none">
          <MDX components={mdxComponents} />
        </div>
        {page.data.faqs?.length ? <FaqSection faqs={page.data.faqs} /> : null}
      </article>
    </>
  )
}

export async function generateStaticParams() {
  return source.generateParams().filter(
    (p: { slug: string[] }) => p.slug.length === 0 || p.slug[0] !== "course",
  )
}
