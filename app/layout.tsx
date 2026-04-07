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
    locale: "en_US",
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
  name: "HowOpenClaw",
  url: siteUrl,
  logo: `${siteUrl}/clawlogo.png`,
  sameAs: [
    "https://github.com/kaster-23/howopenclaw-learn",
    "https://x.com/imfrancoierace",
  ],
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
