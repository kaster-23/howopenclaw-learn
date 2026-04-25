import Link from "next/link"
import Image from "next/image"
import { OPENCLAW_VERSION } from "@/lib/openclaw-version"

export function Footer() {
  const syncedVersion = OPENCLAW_VERSION

  return (
    <footer className="relative z-10 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 items-start">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-x-2.5 mb-4 w-fit">
              <Image src="/clawlogo.png" alt="" width={22} height={22} />
              <span className="text-base font-semibold tracking-tight text-white">
                HowOpenClaw
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
              Community documentation for OpenClaw — the open-source
              self-hosted AI assistant.
            </p>
          </div>

          {/* Course */}
          <div className="md:col-span-2">
            <h4 className="uppercase text-[var(--color-fd-primary)] text-xs font-medium tracking-widest mb-4">
              Course
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/course"
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Browse full course
                </Link>
              </li>
              <li>
                <Link
                  href="/course/0-setup"
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Quick Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="uppercase text-[var(--color-fd-primary)] text-xs font-medium tracking-widest mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/reference/what-is-openclaw" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  What is OpenClaw?
                </Link>
              </li>
              <li>
                <Link href="/reference" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Reference
                </Link>
              </li>
              <li>
                <Link href="/channels" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Channels
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/reference/troubleshooting" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Troubleshooting
                </Link>
              </li>
              <li>
                <Link href="/reference/pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/reference/system-requirements" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  System Requirements
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="uppercase text-[var(--color-fd-primary)] text-xs font-medium tracking-widest mb-4">
              Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/openclaw/openclaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  GitHub Repo
                </a>
              </li>
              <li>
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Official OpenClaw
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/openclaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Community Discord
                </a>
              </li>
              <li>
                <a
                  href="https://docs.openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Official Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-y-3 text-xs text-zinc-500">

          {/* Left */}
          <div className="flex items-center gap-x-1.5 whitespace-nowrap">
            Made with ❤️ in Argentina 🇦🇷 by{" "}
            <a
              href="https://x.com/imfrancoierace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-fd-primary)] hover:underline font-medium"
            >
              @imfrancoierace
            </a>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-1 text-center md:text-left">
            <span>
              © {new Date().getFullYear()} HowOpenClaw · Community project · Not affiliated with OpenClaw
            </span>
            {syncedVersion && (
              <a
                href="https://github.com/openclaw/openclaw/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-1.5 hover:text-zinc-300 transition-colors"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-mono">Synced with OpenClaw {syncedVersion}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
