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

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howopenclaw.com").trim().replace(/\/$/, "").replace("://howopenclaw.com", "://www.howopenclaw.com")

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

const homepageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is OpenClaw?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenClaw is a free, open-source, self-hosted AI assistant that runs on your own machine and connects to Telegram, Discord, WhatsApp, Slack, iMessage, Signal, and more. You bring your own AI provider (Claude, GPT-4o, or local Ollama) — no subscription required.",
      },
    },
    {
      "@type": "Question",
      name: "Is OpenClaw free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenClaw itself is completely free and open source. You only pay for AI API usage if you use a cloud provider like Claude or GPT-4o — typically $1–10/month for personal use. If you use Ollama (a local model), the running cost is zero beyond electricity.",
      },
    },
    {
      "@type": "Question",
      name: "How do I install OpenClaw?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Install Node.js 22.16+, then run 'npm install -g openclaw@latest' in your terminal, then run 'openclaw onboard --install-daemon' and follow the wizard. The full setup takes about 15 minutes and requires no coding experience. A step-by-step guide is at howopenclaw.com/course/0-setup.",
      },
    },
    {
      "@type": "Question",
      name: "What messaging apps does OpenClaw support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenClaw supports Telegram, WhatsApp, Discord, Slack, iMessage (macOS only), Signal, Microsoft Teams, and a built-in browser WebChat. You can connect multiple channels simultaneously — for example, Telegram and Slack at the same time.",
      },
    },
    {
      "@type": "Question",
      name: "Does OpenClaw send my data to the cloud?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only message content goes to your AI provider (Anthropic, OpenAI, or another) to generate responses. Your files, memory, and configuration stay entirely on your machine. If you use Ollama for local inference, nothing leaves your device at all.",
      },
    },
    {
      "@type": "Question",
      name: "What hardware do I need to run OpenClaw?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenClaw itself needs only 512MB RAM — it's a lightweight Node.js process. Using a cloud AI provider (Claude, GPT-4o) keeps hardware requirements minimal. For local Ollama models, 8–16GB RAM is recommended. It runs on a Raspberry Pi 4 with a cloud provider.",
      },
    },
    {
      "@type": "Question",
      name: "How is OpenClaw different from ChatGPT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ChatGPT is a hosted web interface with a $20/month subscription. OpenClaw is self-hosted — you own it, your data stays on your machine, and it works through Telegram or WhatsApp instead of a browser. You choose your own AI model and pay only API costs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I run OpenClaw on a Raspberry Pi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The OpenClaw Gateway runs on any device with Node.js 22.16+, including Raspberry Pi 4 (2GB+ RAM). Connect it to a cloud AI provider like Claude or GPT-4o for full performance. Running local Ollama models on a Pi is possible but slow.",
      },
    },
  ],
}

export default function LandingPage() {
  const syncedVersion = getSyncedVersion()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqJsonLd) }}
      />
      <BackgroundDotsLoader />
      <LandingContent syncedVersion={syncedVersion} />
      <Footer />
    </>
  )
}
