import Link from "next/link"
import type { ReactNode } from "react"

interface Faq {
  q: string
  a: string
}

interface FaqSectionProps {
  faqs: Faq[]
}

function renderAnswer(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: (string | ReactNode)[] = []
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const [, label, href] = match
    const isExternal = href.startsWith("http")
    parts.push(
      isExternal ? (
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-fd-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {label}
        </a>
      ) : (
        <Link
          key={match.index}
          href={href}
          className="text-[var(--color-fd-primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {label}
        </Link>
      )
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 1 ? <>{parts}</> : text
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (!faqs?.length) return null
  return (
    <section className="mt-12 pt-8 border-t border-fd-border" aria-label="Frequently asked questions">
      <p className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground opacity-60 mb-5">FAQ</p>
      <dl className="space-y-5">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <dt className="text-sm font-medium text-fd-muted-foreground mb-1">{q}</dt>
            <dd className="text-sm text-fd-muted-foreground/70 leading-relaxed m-0">{renderAnswer(a)}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
