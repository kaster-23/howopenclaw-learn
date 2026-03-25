import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProvider } from "fumadocs-ui/provider/next"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clawdocs.com"
const siteDescription =
  "Community documentation for OpenClaw — the open-source self-hosted AI assistant. Installation, security, channels, automation, and more."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClawDocs",
    template: "%s – ClawDocs",
  },
  description: siteDescription,
  icons: {
    icon: "/clawlogofav.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClawDocs",
    url: "/",
    title: "ClawDocs",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClawDocs — Community documentation for OpenClaw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawDocs",
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ClawDocs",
  url: siteUrl,
  description: siteDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <RootProvider>
{children}
        </RootProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  )
}
