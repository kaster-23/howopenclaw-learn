import Image from "next/image"
import Link from "next/link"
import fs from "fs"
import path from "path"

function getSyncedVersion(): string {
  try {
    return fs.readFileSync(path.resolve(process.cwd(), ".openclaw-last-version"), "utf8").trim()
  } catch {
    return ""
  }
}

export function Footer() {
  const syncedVersion = getSyncedVersion()
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-50 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-2 rounded-sm"
            >
              <Image src="/clawlogo.png" alt="" width={18} height={18} />
              HowOpenClaw
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[220px]">
              Community documentation for OpenClaw — the open-source self-hosted AI assistant.
            </p>
          </div>

          {/* Learn */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">Learn</h3>
            <nav aria-label="Learn" className="flex flex-col gap-2">
              {[
                { label: "Foundation", href: "/foundation/what-is-openclaw" },
                { label: "Goals", href: "/goals" },
                { label: "Level Up", href: "/level-up" },
                { label: "Reference", href: "/reference" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1 rounded-sm"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">Links</h3>
            <nav aria-label="External links" className="flex flex-col gap-2">
              {[
                { label: "GitHub", href: "https://github.com/openclaw/openclaw" },
                { label: "OpenClaw", href: "https://openclaw.ai" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fd-primary)]/70 focus-visible:ring-offset-1 rounded-sm"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col gap-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Created by{" "}
            <a
              href="https://x.com/imfrancoierace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium"
            >
              Franco Ierace
            </a>
            {" "}· Agentic systems. AI-native products. Shipping in public.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} HowOpenClaw · Community project · Not affiliated with OpenClaw
          </p>
          {syncedVersion && (
            <a
              href="https://github.com/openclaw/openclaw/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced with OpenClaw {syncedVersion}
            </a>
          )}
          </div>
        </div>
      </div>
    </footer>
  )
}
