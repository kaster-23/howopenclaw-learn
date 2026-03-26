import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProvider } from "fumadocs-ui/provider/next"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://howopenclaw.com"
const siteDescription =
  "Community documentation for OpenClaw — the open-source self-hosted AI assistant. Installation, security, channels, automation, and more."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HowOpenClaw",
    template: "%s – HowOpenClaw",
  },
  description: siteDescription,
  icons: {
    icon: "/clawlogofav.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HowOpenClaw",
    url: "/",
    title: "HowOpenClaw",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "HowOpenClaw — Community documentation for OpenClaw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HowOpenClaw",
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
  name: "HowOpenClaw",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OpenClaw",
  url: siteUrl,
  logo: `${siteUrl}/openclaw.svg`,
  sameAs: ["https://github.com/openclaw"],
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
        <RootProvider theme={{ defaultTheme: "system" }}>
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
      </body>
    </html>
  )
}
