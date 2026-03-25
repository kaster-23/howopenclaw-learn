import type { NextConfig } from "next"
import path from "path"
import { createMDX } from "fumadocs-mdx/next"

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  async redirects() {
    return [
      // Getting Started → Foundation
      { source: "/getting-started/what-is-openclaw", destination: "/foundation/what-is-openclaw", permanent: true },
      { source: "/getting-started/installation", destination: "/foundation/install", permanent: true },
      { source: "/getting-started/first-24-hours", destination: "/foundation/soul-md", permanent: true },

      // Core Concepts → scattered
      { source: "/core-concepts/soul-md", destination: "/foundation/soul-md", permanent: true },
      { source: "/core-concepts/memory", destination: "/level-up/memory", permanent: true },
      { source: "/core-concepts/skills", destination: "/level-up/skills", permanent: true },
      { source: "/core-concepts/automation", destination: "/goals/daily-briefing/setup", permanent: true },

      // Security → Foundation (moved from Level Up)
      { source: "/level-up/security", destination: "/foundation/security", permanent: true },
      { source: "/security/dm-policies", destination: "/foundation/security", permanent: true },
      { source: "/security/sandboxing", destination: "/foundation/security", permanent: true },
      { source: "/security/api-keys", destination: "/foundation/security", permanent: true },
      { source: "/security/clawhub-vetting", destination: "/level-up/skills", permanent: true },
      { source: "/security/network-security", destination: "/foundation/security", permanent: true },

      // Troubleshooting → Reference (moved from Level Up)
      { source: "/level-up/troubleshooting", destination: "/reference/troubleshooting", permanent: true },

      // Channels → Level Up
      { source: "/channels/overview", destination: "/level-up/channels", permanent: true },
      { source: "/channels/imessage", destination: "/goals/personal-assistant/channel", permanent: true },
      { source: "/channels/slack", destination: "/goals/work-hub/slack", permanent: true },
      { source: "/channels/whatsapp", destination: "/goals/personal-assistant/channel", permanent: true },
      { source: "/channels/telegram", destination: "/foundation/first-channel", permanent: true },
      { source: "/channels/discord", destination: "/level-up/channels", permanent: true },
      { source: "/channels/signal", destination: "/level-up/channels", permanent: true },
      { source: "/channels/webchat", destination: "/foundation/install", permanent: true },

      // Advanced → Level Up / Goals
      { source: "/advanced/sub-agents", destination: "/level-up/sub-agents", permanent: true },
      { source: "/advanced/voice", destination: "/goals/voice/setup", permanent: true },
      { source: "/advanced/deployment", destination: "/level-up/deployment", permanent: true },
      { source: "/advanced/cost-management", destination: "/level-up/models", permanent: true },

      // More
      { source: "/cheatsheet", destination: "/reference/cli", permanent: true },
      { source: "/openclaw-vs-claude-code", destination: "/reference/concepts", permanent: true },
      { source: "/playbooks", destination: "/foundation/set-your-goal", permanent: true },
    ]
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
