import { source } from "@/lib/source"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { FaqSection } from "@/components/faq-section"
import { Callout } from "fumadocs-ui/components/callout"
import { Steps, Step } from "fumadocs-ui/components/steps"
import { Card, Cards } from "fumadocs-ui/components/card"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { Mermaid } from "@/components/mdx/mermaid"
import { notFound } from "next/navigation"

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
  params: Promise<{ slug: string[] }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howopenclaw.com"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}

  const pageTitle = `${page.data.title} – HowOpenClaw`
  const description =
    page.data.description ??
    "Community documentation for OpenClaw — the open-source self-hosted AI assistant."

  return {
    title: page.data.title,
    description,
    authors: [{ name: "HowOpenClaw Community", url: siteUrl }],
    openGraph: {
      title: pageTitle,
      description,
      url: `${siteUrl}${page.url}`,
      type: "article",
      siteName: "HowOpenClaw",
      locale: "en_US",
      images: [{ url: "/og-image.png", width: 2414, height: 1274, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: "@imfrancoierace",
      images: ["/og-image.png"],
    },
    alternates: { canonical: `${siteUrl}${page.url}` },
  }
}

function buildBreadcrumbList(slug: string[], pageTitle: string) {
  const items: { "@type": string; position: number; name: string; item: string }[] = [
    { "@type": "ListItem", position: 1, name: "HowOpenClaw", item: siteUrl },
  ]
  let pos = 2
  for (let i = 0; i < slug.length - 1; i++) {
    const parent = source.getPage(slug.slice(0, i + 1))
    const name =
      parent?.data.title ??
      slug[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    items.push({
      "@type": "ListItem",
      position: pos++,
      name,
      item: `${siteUrl}/${slug.slice(0, i + 1).join("/")}`,
    })
  }
  items.push({
    "@type": "ListItem",
    position: pos,
    name: pageTitle,
    item: `${siteUrl}/${slug.join("/")}`,
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
  Tabs,
  Mermaid,
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  const pageUrl = `${siteUrl}${page.url}`
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${pageUrl}#article`,
    headline: page.data.title,
    description: page.data.description,
    url: pageUrl,
    datePublished: "2025-03-01",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
    ...(page.data.readTime ? { timeRequired: `PT${page.data.readTime}M` } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "HowOpenClaw",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/clawlogo.png` },
    },
    author: {
      "@type": "Organization",
      name: "HowOpenClaw Community",
      url: siteUrl,
    },
    isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "HowOpenClaw", url: siteUrl },
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

  const breadcrumbJsonLd = buildBreadcrumbList(slug, page.data.title)

  const faqJsonLd = page.data.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.data.faqs.map(({ q, a }: { q: string; a: string }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
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
