"use client"
import Link from "next/link"
import Image from "next/image"
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { Sunrise, Bot, Building2, BookOpen, Home, Mic, TrendingUp, Brain, Layers, Wrench, Server } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { LandingHeader } from "@/components/landing-header"

interface Goal {
  Icon: LucideIcon
  label: string
  title: string
  description: string
  href: string
  time: string
}

const goals: Goal[] = [
  {
    Icon: Sunrise,
    label: "Beginner",
    title: "Daily Briefing",
    description: "Every morning, your agent sends a summary of weather, calendar, and email — automatically.",
    href: "/goals/daily-briefing/setup",
    time: "~20 min",
  },
  {
    Icon: Bot,
    label: "Beginner",
    title: "Personal Assistant",
    description: "Text your agent like a person. It handles tasks, answers questions, and remembers context.",
    href: "/goals/personal-assistant/channel",
    time: "~45 min",
  },
  {
    Icon: Building2,
    label: "Intermediate",
    title: "Work Hub on Slack",
    description: "Your agent lives in Slack, preps your meetings, triages emails, and posts updates.",
    href: "/goals/work-hub/slack",
    time: "~1.5 hr",
  },
  {
    Icon: BookOpen,
    label: "Intermediate",
    title: "Research Assistant",
    description: "Search, fetch, and summarize any topic. Build a knowledge base that grows over time.",
    href: "/goals/research/setup",
    time: "~1 hr",
  },
  {
    Icon: Home,
    label: "Intermediate",
    title: "Life Ops",
    description: "Manage household logistics, remind family members, and run recurring task tracking.",
    href: "/goals/life-ops/setup",
    time: "~1 hr",
  },
  {
    Icon: Mic,
    label: "Intermediate",
    title: "Voice Control",
    description: "Talk to your agent hands-free. It listens, thinks, and responds out loud.",
    href: "/goals/voice/setup",
    time: "~45 min",
  },
  {
    Icon: TrendingUp,
    label: "Intermediate",
    title: "Finance Alerts",
    description: "Pre-market briefings, watchlist alerts, and portfolio summaries — on your schedule.",
    href: "/goals/finance/setup",
    time: "~2 hr",
  },
]

const foundationSteps = [
  { n: "1", label: "What is OpenClaw?", slug: "what-is-openclaw" },
  { n: "2", label: "Install & First Message", slug: "install" },
  { n: "3", label: "Write Your SOUL.md", slug: "soul-md" },
  { n: "4", label: "Connect a Channel", slug: "first-channel" },
  { n: "5", label: "Set Your Goal", slug: "set-your-goal" },
]

interface LevelUpItem {
  Icon: LucideIcon
  title: string
  description: string
  href: string
}

const levelUpItems: LevelUpItem[] = [
  {
    Icon: Brain,
    title: "Memory",
    description: "Your agent remembers context across conversations and builds knowledge over time.",
    href: "/level-up/memory",
  },
  {
    Icon: Layers,
    title: "Multi-Channel",
    description: "Reach it from Slack, iMessage, Telegram, and more — all at once.",
    href: "/channels/overview",
  },
  {
    Icon: Wrench,
    title: "Skills",
    description: "Give your agent new abilities with custom tools and automations.",
    href: "/level-up/skills",
  },
  {
    Icon: Server,
    title: "24/7 Deployment",
    description: "Run it on a server so it works even when your laptop is closed.",
    href: "/level-up/deployment",
  },
]

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

// Reduced-motion variants — opacity only, no position shift
const fadeUpReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

const staggerReduced = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
}

const ease = [0.25, 0.46, 0.45, 0.94] as const

function SectionConnector({
  label,
  prefersReducedMotion,
}: {
  label: string
  prefersReducedMotion: boolean
}) {
  return (
    <div className="flex flex-col items-center py-2 gap-1">
      <m.div
        className="w-px bg-zinc-200 dark:bg-zinc-800"
        initial={{ height: prefersReducedMotion ? 20 : 0 }}
        whileInView={{ height: 20 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
      />
      <m.span
        className="text-sm font-medium text-zinc-500 dark:text-zinc-500 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
        initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.2 }}
      >
        {label}
      </m.span>
      <m.div
        className="w-px bg-zinc-200 dark:bg-zinc-800"
        initial={{ height: prefersReducedMotion ? 20 : 0 }}
        whileInView={{ height: 20 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
      />
    </div>
  )
}

export function LandingContent() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const motionFadeUp = prefersReducedMotion ? fadeUpReduced : fadeUp
  const motionStagger = prefersReducedMotion ? staggerReduced : stagger
  const motionStaggerFast = prefersReducedMotion ? staggerReduced : staggerFast

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen overflow-hidden dot-grid">
        {/* Radial brand glow */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 45% at 50% -5%, hsl(0 100% 65% / 0.12), transparent 70%)",
          }}
        />

        <LandingHeader />

        <main id="main-content" className="relative z-10">
          {/* Hero */}
          <m.section
            className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center"
            variants={motionStagger}
            initial="hidden"
            animate="visible"
          >
            {/* Logo */}
            <m.div
              variants={motionFadeUp}
              transition={{ duration: 0.5, ease }}
              className="mb-8"
            >
              <Image
                src="/openclaw.svg"
                alt="OpenClaw"
                width={125}
                height={125}
                priority
                className="mx-auto w-[90px] sm:w-[125px] h-auto drop-shadow-[0_0_24px_hsl(0_100%_65%/0.25)]"
              />
            </m.div>

            {/* Headline */}
            <m.h1
              variants={motionFadeUp}
              transition={{ duration: 0.55, ease }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-5 leading-[1.08]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400">
                Have a working
              </span>
              <br />
              <span
                className="text-[var(--color-fd-primary)]"
                style={{ textShadow: "0 0 40px hsl(0 100% 65% / 0.35)" }}
              >
                OpenClaw
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400">
                by tonight.
              </span>
            </m.h1>

            {/* Subheadline */}
            <m.p
              variants={motionFadeUp}
              transition={{ duration: 0.5, ease }}
              className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed max-w-xl mx-auto"
            >
              No config rabbit holes. No overwhelming docs. A clear path from install to your first real result — built around what you want to build, not how OpenClaw works internally.
            </m.p>

            {/* CTAs */}
            <m.div
              variants={motionFadeUp}
              transition={{ duration: 0.5, ease }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <m.div
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/foundation/what-is-openclaw"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[hsl(0,100%,45%)] text-white text-sm font-medium hover:bg-[hsl(0,100%,40%)] ring-2 ring-[var(--color-fd-primary)]/0 hover:ring-[var(--color-fd-primary)]/30 transition-colors duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-[var(--color-fd-primary)]/70"
                >
                  Start Level 1
                  <ArrowRight />
                </Link>
              </m.div>
              <m.div
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/foundation/set-your-goal"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                >
                  Pick a goal first
                </Link>
              </m.div>
            </m.div>
          </m.section>

          {/* Level 1 — Get set up */}
          <section className="max-w-5xl mx-auto px-6 pb-10">
            <m.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-sm font-bold font-mono tracking-widest text-[var(--color-fd-primary)] bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 px-2 py-1 rounded self-start">Level 1</span>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Get set up</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Start here — everyone does this first · ~1 hour total</p>
                </div>
              </div>
              <Link
                href="/foundation"
                aria-label="View all Foundation topics"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-3 py-3.5 -mx-3 -my-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1 rounded"
              >
                View all
                <ArrowRight />
              </Link>
            </m.div>

            <m.div
              className="grid grid-cols-2 sm:grid-cols-5 gap-3"
              variants={motionStaggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {foundationSteps.map((step) => (
                <m.div
                  key={step.n}
                  variants={motionFadeUp}
                  transition={{ duration: 0.4, ease }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                  style={{ originX: 0.5 }}
                >
                  <Link
                    href={`/foundation/${step.slug}`}
                    aria-label={`Step ${step.n}: ${step.label}`}
                    className="group flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] hover:border-[var(--color-fd-primary)]/40 hover:shadow-[0_4px_16px_hsl(0_100%_65%/0.08)] transition-colors duration-200 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 flex items-center justify-center text-[var(--color-fd-primary)] text-sm font-bold">
                      {step.n}
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-snug group-hover:text-[var(--color-fd-primary)] transition-colors duration-200">{step.label}</span>
                  </Link>
                </m.div>
              ))}
            </m.div>
          </section>

          <SectionConnector label="then build something real" prefersReducedMotion={prefersReducedMotion} />

          {/* Level 2 — Build something */}
          <section className="max-w-5xl mx-auto px-6 pt-6 pb-10">
            <m.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-sm font-bold font-mono tracking-widest text-[var(--color-fd-primary)] bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 px-2 py-1 rounded self-start">Level 2</span>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Build something</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Pick one goal · Follow the path · Have something running by the end</p>
                </div>
              </div>
              <Link
                href="/goals"
                aria-label="View all Goals"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-3 py-3.5 -mx-3 -my-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1 rounded"
              >
                View all
                <ArrowRight />
              </Link>
            </m.div>

            <m.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
              variants={motionStaggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {goals.map((goal) => (
                <m.div
                  key={goal.title}
                  variants={motionFadeUp}
                  transition={{ duration: 0.4, ease }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                >
                  <Link
                    href={goal.href}
                    aria-label={`${goal.title} — ${goal.label} goal, estimated ${goal.time}`}
                    className="group flex flex-col gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] hover:border-[var(--color-fd-primary)]/40 hover:shadow-[0_4px_16px_hsl(0_100%_65%/0.08)] transition-colors duration-200 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 flex items-center justify-center text-[var(--color-fd-primary)]">
                        <goal.Icon size={16} strokeWidth={1.75} />
                      </div>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full border ${
                        goal.label === "Beginner"
                          ? "bg-emerald-500/[0.07] dark:bg-emerald-500/[0.08] text-emerald-600/80 dark:text-emerald-400/70 border-emerald-500/15 dark:border-emerald-500/20"
                          : "bg-amber-500/[0.07] dark:bg-amber-500/[0.08] text-amber-600/80 dark:text-amber-400/70 border-amber-500/15 dark:border-amber-500/20"
                      }`}>
                        {goal.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-[var(--color-fd-primary)] transition-colors duration-200 leading-snug">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
                      {goal.time}
                    </div>
                  </Link>
                </m.div>
              ))}
            </m.div>
          </section>

          <SectionConnector label="then expand what it can do" prefersReducedMotion={prefersReducedMotion} />

          {/* Level 3 — Go further */}
          <section className="max-w-5xl mx-auto px-6 pt-6 pb-16 sm:pb-24">
            <m.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-sm font-bold font-mono tracking-widest text-[var(--color-fd-primary)] bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 px-2 py-1 rounded self-start">Level 3</span>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Go further</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Once your agent is running — make it smarter, faster, and always on</p>
                </div>
              </div>
              <Link
                href="/level-up"
                aria-label="View all Level Up topics"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-3 py-3.5 -mx-3 -my-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1 rounded"
              >
                View all
                <ArrowRight />
              </Link>
            </m.div>

            <m.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
              variants={motionStaggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {levelUpItems.map((item) => (
                <m.div
                  key={item.title}
                  variants={motionFadeUp}
                  transition={{ duration: 0.4, ease }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                >
                  <Link
                    href={item.href}
                    aria-label={item.title}
                    className="group flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_0_rgb(0,0,0,0.06)] hover:border-[var(--color-fd-primary)]/40 hover:shadow-[0_4px_16px_hsl(0_100%_65%/0.08)] transition-colors duration-200 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10 flex items-center justify-center text-[var(--color-fd-primary)]">
                      <item.Icon size={14} strokeWidth={1.75} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-[var(--color-fd-primary)] transition-colors duration-200">{item.title}</span>
                      <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed">{item.description}</p>
                    </div>
                  </Link>
                </m.div>
              ))}
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
