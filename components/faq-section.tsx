interface Faq {
  q: string
  a: string
}

interface FaqSectionProps {
  faqs: Faq[]
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (!faqs?.length) return null
  return (
    <section className="mt-12 pt-8 border-t border-fd-border" aria-label="Frequently asked questions">
      <h2 className="text-xl font-semibold text-fd-foreground mb-6">Frequently asked questions</h2>
      <dl className="space-y-6">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-medium text-fd-foreground mb-2">{q}</dt>
            <dd className="text-fd-muted-foreground leading-relaxed m-0">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
