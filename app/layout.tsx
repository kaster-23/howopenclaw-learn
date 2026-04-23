import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import Script from "next/script"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProvider } from "fumadocs-ui/provider/next"
import { SITE_URL as siteUrl } from "@/lib/site-url"
import "./globals.css"

const GA_ID = "G-PHXR859DRF"
const siteDescription =
  "Step-by-step guides to set up OpenClaw, your self-hosted AI assistant. Connect Telegram, Discord, WhatsApp — no cloud subscription needed."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HowOpenClaw",
    template: "%s – HowOpenClaw",
  },
  description: siteDescription,
  keywords: [
    "OpenClaw",
    "self-hosted AI assistant",
    "open-source AI",
    "local AI",
    "personal AI assistant",
    "AI automation",
    "Telegram bot",
    "OpenClaw tutorial",
    "OpenClaw documentation",
  ],
  authors: [{ name: "HowOpenClaw Community", url: siteUrl }],
  icons: {
    icon: [
      { url: "/clawlogofav.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US", // Static metadata — dynamic locale set in page-level metadata
    siteName: "HowOpenClaw",
    url: siteUrl,
    title: "HowOpenClaw",
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 2414,
        height: 1274,
        alt: "HowOpenClaw — Community documentation for OpenClaw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HowOpenClaw",
    description: siteDescription,
    creator: "@imfrancoierace",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "HowOpenClaw",
    url: siteUrl,
    description: siteDescription,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "HowOpenClaw",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/clawlogo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://github.com/kaster-23/howopenclaw-learn",
      "https://x.com/imfrancoierace",
    ],
    knowsAbout: [
      "OpenClaw self-hosted AI assistant",
      "Self-hosted AI",
      "Local AI models",
      "Telegram bots",
      "Discord AI bots",
      "Personal AI assistants",
      "Ollama",
    ],
  }

  let softwareVersion = ""
  try {
    softwareVersion = fs
      .readFileSync(path.resolve(process.cwd(), ".openclaw-last-version"), "utf8")
      .trim()
  } catch { /* version file may not exist */ }

  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://openclaw.ai/#app",
    name: "OpenClaw",
    description:
      "Free, open-source, self-hosted AI assistant. Connects to Telegram, Discord, WhatsApp, Slack, iMessage, Signal, and Microsoft Teams. Runs on your own hardware — no cloud subscription required.",
    url: "https://openclaw.ai",
    downloadUrl: "https://github.com/OpenClaw/OpenClaw/releases",
    installUrl: `${siteUrl}/course/0-setup`,
    applicationCategory: "ProductivityApplication",
    applicationSubCategory: "AI Assistant",
    operatingSystem: ["macOS", "Linux", "Windows"],
    softwareRequirements: "Node.js 22.16 or later",
    ...(softwareVersion ? { softwareVersion } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Self-hosted deployment — no cloud subscription",
      "Connects to Telegram, Discord, WhatsApp, Slack, iMessage, Signal, Microsoft Teams",
      "Supports Claude, GPT-4o, and local Ollama models",
      "Persistent memory with SOUL.md and MEMORY.md",
      "Skill system for calendar, email, web search, and more",
      "Cron jobs for scheduled autonomous tasks",
      "24/7 deployment on VPS or home server",
    ],
    author: {
      "@type": "Organization",
      name: "OpenClaw",
      url: "https://openclaw.ai",
    },
    sameAs: [
      "https://github.com/OpenClaw/OpenClaw",
      "https://openclaw.ai",
    ],
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <RootProvider theme={{ defaultTheme: "dark" }}>
{children}
        </RootProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
