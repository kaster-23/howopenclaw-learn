"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger"
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch"

const navLinkClass =
  "hidden sm:flex items-center min-h-[44px] text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1"

const resources = [
  { label: "What is OpenClaw?", href: "/reference/what-is-openclaw" },
  { label: "Reference", href: "/reference" },
  { label: "Channels", href: "/channels" },
  { label: "Compare", href: "/compare" },
]

export function LandingHeader() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [open])

  const handleButtonKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => menuItemRefs.current[0]?.focus(), 0)
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    },
    []
  )

  const handleMenuKey = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        menuItemRefs.current[index + 1]?.focus()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (index === 0) {
          buttonRef.current?.focus()
        } else {
          menuItemRefs.current[index - 1]?.focus()
        }
      } else if (e.key === "Escape" || e.key === "Tab") {
        setOpen(false)
        if (e.key === "Escape") buttonRef.current?.focus()
      }
    },
    []
  )

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2 rounded-sm"
        >
          <Image src="/clawlogo.png" alt="" width={20} height={20} />
          HowOpenClaw
        </Link>

        <div className="flex items-center gap-0.5">
          <Link href="/course" className={navLinkClass}>
            Course
          </Link>

          {/* Resources dropdown */}
          <div ref={dropdownRef} className="relative hidden sm:block">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              onKeyDown={handleButtonKey}
              aria-expanded={open}
              aria-haspopup="menu"
              className={`flex items-center gap-1 min-h-[44px] text-sm px-3 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1 ${
                open
                  ? "text-[var(--color-fd-primary)] bg-[var(--color-fd-primary)]/8 dark:bg-[var(--color-fd-primary)]/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              Resources
              <ChevronDown
                className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+6px)] w-40 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm overflow-hidden z-50"
              >
                {resources.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    ref={(el) => { menuItemRefs.current[i] = el }}
                    onClick={() => setOpen(false)}
                    onKeyDown={(e) => handleMenuKey(e, i)}
                    className="flex items-center min-h-[44px] px-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[var(--color-fd-primary)] hover:bg-[var(--color-fd-primary)]/5 transition-colors focus-visible:outline-none focus-visible:bg-[var(--color-fd-primary)]/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://github.com/OpenClaw"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            GitHub
          </a>

          <SearchTrigger />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
