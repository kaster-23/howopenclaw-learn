import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import { LandingContent } from "@/components/landing-content"
import { Footer } from "@/components/footer"
import { BackgroundDotsLoader } from "@/components/background-dots-loader"

function getSyncedVersion(): string {
  try {
    return fs.readFileSync(path.resolve(process.cwd(), ".openclaw-last-version"), "utf8").trim()
  } catch {
    return ""
  }
}

const description =
  "Build your own private AI assistant with OpenClaw — no subscriptions, no cloud. 10 beginner-friendly modules to go from zero to running in an hour."

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howopenclaw.com"

export const metadata: Metadata = {
  title: "HowOpenClaw — Learn OpenClaw Step by Step",
  description,
  openGraph: {
    type: "website",
    siteName: "HowOpenClaw",
    locale: "en_US",
    title: "HowOpenClaw — Learn OpenClaw Step by Step",
    description,
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 2414,
        height: 1274,
        alt: "HowOpenClaw — Learn OpenClaw Step by Step",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HowOpenClaw — Learn OpenClaw Step by Step",
    description,
    creator: "@imfrancoierace",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function LandingPage() {
  const syncedVersion = getSyncedVersion()
  return (
    <>
      <BackgroundDotsLoader />
      <LandingContent syncedVersion={syncedVersion} />
      <Footer />
    </>
  )
}
