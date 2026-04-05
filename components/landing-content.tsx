"use client"
import Link from "next/link"
import Image from "next/image"
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { Clock } from "lucide-react"
import { LandingHeader } from "@/components/landing-header"
import { CourseProgress } from "@/components/course/course-progress"

interface Module {
  number: number | string
  title: string
  description: string
  readTime: number
  href: string
}

const modules: Module[] = [
  {
    number: 0,
    title: "Quick Setup",
    description: "Install OpenClaw, run the onboarding wizard, and send your first message.",
    readTime: 5,
    href: "/course/0-setup",
  },
  {
    number: 1,
    title: "How Everything Fits Together",
    description: "The five core components and how a message flows from your phone to an action.",
    readTime: 5,
    href: "/course/1-architecture",
  },
  {
    number: 2,
    title: "Connecting Your Apps",
    description: "Add Telegram, WhatsApp, Slack, and other messaging channels.",
    readTime: 6,
    href: "/course/2-connecting-apps",
  },
  {
    number: 3,
    title: "Skills & Tools",
    description: "Give your agent abilities from ClawHub — calendar, email, search, and more.",
    readTime: 6,
    href: "/course/3-skills-tools",
  },
  {
    number: 4,
    title: "Writing Good Prompts",
    description: "Get better, more consistent results with clear and structured prompts.",
    readTime: 5,
    href: "/course/4-prompts",
  },
  {
    number: 5,
    title: "Memory & Personality",
    description: "Customize who your agent is and what it remembers between conversations.",
    readTime: 8,
    href: "/course/5-memory-personality",
  },
  {
    number: 6,
    title: "Autonomous Tasks",
    description: "Schedule cron jobs, daily briefings, and deploy for 24/7 operation.",
    readTime: 6,
    href: "/course/6-autonomous-tasks",
  },
  {
    number: 7,
    title: "Real-World Projects",
    description: "Build a daily briefing, personal assistant, research tool, or content workflow.",
    readTime: 5,
    href: "/course/7-projects",
  },
  {
    number: 8,
    title: "Security & Ethics",
    description: "Sandboxing, prompt injection, API key management, and audit logging.",
    readTime: 6,
    href: "/course/8-security-ethics",
  },
  {
    number: 9,
    title: "Next Steps & Community",
    description: "Troubleshooting, updates, contributing, and joining the community.",
    readTime: 4,
    href: "/course/9-next-steps",
  },
]

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }
const fadeUpReduced = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } } }
const staggerReduced = { hidden: {}, visible: { transition: { staggerChildren: 0, delayChildren: 0 } } }
const ease = [0.25, 0.46, 0.45, 0.94] as const

export function LandingContent({ syncedVersion }: { syncedVersion?: string }) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const motionFadeUp = prefersReducedMotion ? fadeUpReduced : fadeUp
  const motionStagger = prefersReducedMotion ? staggerReduced : stagger
  const motionStaggerFast = prefersReducedMotion ? staggerReduced : staggerFast

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen overflow-hidden">
        {/* Radial brand glow */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: "radial-gradient(ellipse 80% 45% at 50% -5%, hsl(0 100% 65% / 0.08), transparent 70%)" }}
        />

        <LandingHeader />

        <main id="main-content" className="relative z-10">
          {/* Hero */}
          <m.section
            className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 pb-10 sm:pb-14 text-center"
            variants={motionStagger}
            initial="hidden"
            animate="visible"
          >
            {syncedVersion && (
              <m.div variants={motionFadeUp} transition={{ duration: 0.4, ease }} className="mb-6">
                <a
                  href="https://github.com/openclaw/openclaw/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors backdrop-blur-sm"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced with OpenClaw {syncedVersion}
                </a>
              </m.div>
            )}

            <m.div variants={motionFadeUp} transition={{ duration: 0.5, ease }} className="mb-8">
              <Image
                src="/openclaw.svg"
                alt="OpenClaw"
                width={125}
                height={125}
                priority
                className="mx-auto w-[90px] sm:w-[125px] h-auto drop-shadow-[0_0_24px_hsl(0_100%_65%/0.25)]"
              />
            </m.div>

            <m.h1
              variants={motionFadeUp}
              transition={{ duration: 0.55, ease }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.1]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400">
                Learn
              </span>{" "}
              <span
                className="text-[var(--color-fd-primary)]"
                style={{ textShadow: "0 0 40px hsl(0 100% 65% / 0.35)" }}
              >
                OpenClaw
              </span>
            </m.h1>

            <m.p
              variants={motionFadeUp}
              transition={{ duration: 0.5, ease }}
              className="text-lg text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed max-w-xl mx-auto"
            >
              The beginner-friendly guide to your own AI assistant.
              <br className="hidden sm:block" />
              10 modules. ~1 hour. No experience needed.
            </m.p>

            <m.div variants={motionFadeUp} transition={{ duration: 0.5, ease }} className="max-w-md mx-auto mb-10">
              <CourseProgress />
            </m.div>

            <m.div
              variants={motionFadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <m.div
                className="inline-block"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/course/0-setup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[var(--color-fd-primary)] hover:bg-[var(--color-fd-primary)]/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                >
                  Start the course
                  <ArrowRight />
                </Link>
              </m.div>
            </m.div>
          </m.section>

          {/* Module Grid */}
          <section className="max-w-5xl mx-auto px-6 pb-16 sm:pb-24">
            <m.div
              className="mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Course modules
              </h2>
            </m.div>

            <m.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              variants={motionStaggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {modules.map((mod) => (
                <m.div
                  key={mod.href}
                  variants={motionFadeUp}
                  transition={{ duration: 0.4, ease }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                >
                  <Link
                    href={mod.href}
                    aria-label={`Module ${mod.number}: ${mod.title}`}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] hover:border-[var(--color-fd-primary)]/40 hover:shadow-[0_4px_16px_hsl(0_100%_65%/0.08)] transition-all duration-200 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-zinc-500 dark:text-zinc-400 group-hover:bg-[var(--color-fd-primary)]/10 group-hover:text-[var(--color-fd-primary)] transition-colors">
                      {mod.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-[var(--color-fd-primary)] transition-colors leading-snug mb-1">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
                        {mod.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                        <Clock size={12} />
                        {mod.readTime} min
                      </span>
                    </div>
                  </Link>
                </m.div>
              ))}
            </m.div>

            {/* Resources */}
            <m.div
              className="mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Additional resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Reference", description: "CLI commands, concepts, troubleshooting", href: "/reference" },
                  { title: "Channels", description: "Setup guides for every messaging platform", href: "/channels" },
                  { title: "Compare", description: "OpenClaw vs ChatGPT, n8n, Zapier, and more", href: "/compare" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                  >
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-[var(--color-fd-primary)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </m.div>
          </section>
        </main>
      </div>
    </LazyMotion>
  )
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 7H12M7 2L12 7L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
