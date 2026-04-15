import Link from "next/link"
import { BookOpen, Radio, Scale, ExternalLink, MessageCircle } from "lucide-react"

const linkBase =
  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0"

export function SidebarFooterLinks() {
  return (
    <div className="border-t border-fd-border px-2 pt-3 pb-2 flex flex-col gap-0.5">
      <Link href="/reference" className={linkBase}>
        <BookOpen />
        Reference
      </Link>
      <Link href="/channels" className={linkBase}>
        <Radio />
        Channels
      </Link>
      <Link href="/compare" className={linkBase}>
        <Scale />
        Compare
      </Link>

      <div className="my-1.5 h-px bg-fd-border/60" aria-hidden="true" />

      <a
        href="https://discord.gg/openclaw"
        target="_blank"
        rel="noopener noreferrer"
        className={linkBase}
      >
        <MessageCircle />
        Community Discord
        <ExternalLink className="ml-auto opacity-40" />
      </a>
      <a
        href="https://openclaw.ai"
        target="_blank"
        rel="noopener noreferrer"
        className={linkBase}
      >
        <ExternalLink />
        openclaw.ai
        <ExternalLink className="ml-auto opacity-40" />
      </a>
    </div>
  )
}
