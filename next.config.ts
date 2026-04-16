// Build: 2026-04-08
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
      "frame-src 'self' https://www.youtube.com https://youtube.com",
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
      // ── Phase-1 legacy paths → final course destinations (no chains) ──

      // Getting Started → course
      { source: "/getting-started/what-is-openclaw", destination: "/course/0-setup", permanent: true },
      { source: "/getting-started/installation", destination: "/course/0-setup", permanent: true },
      { source: "/getting-started/first-24-hours", destination: "/course/5-memory-personality", permanent: true },

      // Core Concepts → course
      { source: "/core-concepts/soul-md", destination: "/course/5-memory-personality", permanent: true },
      { source: "/core-concepts/memory", destination: "/course/5-memory-personality", permanent: true },
      { source: "/core-concepts/skills", destination: "/course/3-skills-tools", permanent: true },
      { source: "/core-concepts/automation", destination: "/course/7-projects/daily-briefing", permanent: true },

      // Security → course
      { source: "/level-up/security", destination: "/course/8-security-ethics", permanent: true },
      { source: "/security/dm-policies", destination: "/course/8-security-ethics", permanent: true },
      { source: "/security/sandboxing", destination: "/course/8-security-ethics", permanent: true },
      { source: "/security/api-keys", destination: "/course/8-security-ethics", permanent: true },
      { source: "/security/clawhub-vetting", destination: "/course/3-skills-tools", permanent: true },
      { source: "/security/network-security", destination: "/course/8-security-ethics", permanent: true },

      // Troubleshooting → reference (no chain)
      { source: "/level-up/troubleshooting", destination: "/reference/troubleshooting", permanent: true },

      // Channels (no chain)
      { source: '/level-up/channels/:path*', destination: '/channels/:path*', permanent: true },

      // Advanced → course
      { source: "/advanced/sub-agents", destination: "/course/6-autonomous-tasks", permanent: true },
      { source: "/advanced/voice", destination: "/course/7-projects/personal-assistant", permanent: true },
      { source: "/advanced/deployment", destination: "/course/6-autonomous-tasks", permanent: true },
      { source: "/advanced/cost-management", destination: "/course/1-architecture", permanent: true },

      // Misc legacy → final destinations
      { source: "/cheatsheet", destination: "/reference/cli", permanent: true },
      { source: "/openclaw-vs-claude-code", destination: "/reference/concepts", permanent: true },
      { source: "/playbooks", destination: "/course/7-projects", permanent: true },

      // Old challenge paths → course
      { source: "/challenge", destination: "/course/0-setup", permanent: true },
      { source: "/challenge/install", destination: "/course/0-setup", permanent: true },
      { source: "/challenge/deploy", destination: "/course/0-setup", permanent: true },
      { source: "/challenge/execute", destination: "/course/2-connecting-apps", permanent: true },
      { source: "/challenge/complete", destination: "/course", permanent: true },

      // Old how (missions) paths → course
      { source: "/how", destination: "/course", permanent: true },
      { source: "/how/mission-1", destination: "/course/0-setup", permanent: true },
      { source: "/how/mission-2", destination: "/course/2-connecting-apps", permanent: true },
      { source: "/how/mission-3", destination: "/course/5-memory-personality", permanent: true },
      { source: "/how/mission-4", destination: "/course/5-memory-personality", permanent: true },
      { source: "/how/mission-5", destination: "/course/3-skills-tools", permanent: true },
      { source: "/how/mission-6", destination: "/course/6-autonomous-tasks", permanent: true },
      { source: "/how/mission-7", destination: "/course/6-autonomous-tasks", permanent: true },
      { source: "/how/certificate", destination: "/course/9-next-steps", permanent: true },

      // Old foundation paths → course
      { source: "/foundation", destination: "/course", permanent: true },
      { source: "/foundation/what-is-openclaw", destination: "/course/0-setup", permanent: true },
      { source: "/foundation/install", destination: "/course/0-setup", permanent: true },
      { source: "/foundation/first-channel", destination: "/course/2-connecting-apps", permanent: true },
      { source: "/foundation/soul-md", destination: "/course/5-memory-personality", permanent: true },
      { source: "/foundation/security", destination: "/course/8-security-ethics", permanent: true },
      { source: "/foundation/set-your-goal", destination: "/course/7-projects", permanent: true },

      // Old goals paths → course projects
      { source: "/goals", destination: "/course/7-projects", permanent: true },
      { source: "/goals/daily-briefing/:path*", destination: "/course/7-projects/daily-briefing", permanent: true },
      { source: "/goals/personal-assistant/:path*", destination: "/course/7-projects/personal-assistant", permanent: true },
      { source: "/goals/research/:path*", destination: "/course/7-projects/research-companion", permanent: true },
      { source: "/goals/voice/:path*", destination: "/course/7-projects/personal-assistant", permanent: true },
      { source: "/goals/work-hub/:path*", destination: "/course/7-projects", permanent: true },
      { source: "/goals/content/:path*", destination: "/course/7-projects/content-creator", permanent: true },

      // Old level-up paths → course
      { source: "/level-up", destination: "/course", permanent: true },
      { source: "/level-up/memory", destination: "/course/5-memory-personality", permanent: true },
      { source: "/level-up/skills", destination: "/course/3-skills-tools", permanent: true },
      { source: "/level-up/sub-agents", destination: "/course/6-autonomous-tasks", permanent: true },
      { source: "/level-up/models", destination: "/course/1-architecture", permanent: true },
      { source: "/level-up/deployment", destination: "/course/6-autonomous-tasks", permanent: true },
      { source: "/level-up/multi-channel", destination: "/course/2-connecting-apps", permanent: true },
      { source: "/level-up/mobile", destination: "/course/9-next-steps", permanent: true },
    ]
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
