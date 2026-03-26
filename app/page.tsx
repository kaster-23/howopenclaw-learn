import type { Metadata } from "next"
import { LandingContent } from "@/components/landing-content"

const description =
  "Practical, goal-driven guides for building your personal AI assistant with OpenClaw. Pick a goal. Follow the path. Ship something real."

export const metadata: Metadata = {
  title: "HowOpenClaw — Learn OpenClaw Step by Step",
  description,
  openGraph: {
    title: "HowOpenClaw — Learn OpenClaw Step by Step",
    description,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "HowOpenClaw — Learn OpenClaw Step by Step",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HowOpenClaw — Learn OpenClaw Step by Step",
    description,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function LandingPage() {
  return <LandingContent />
}
