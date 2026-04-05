import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface ModuleNavProps {
  prevHref?: string
  prevLabel?: string
  nextHref?: string
  nextLabel?: string
}

export function ModuleNav({
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
}: ModuleNavProps) {
  return (
    <nav
      className="not-prose mt-12 grid gap-4 sm:grid-cols-2"
      aria-label="Module navigation"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="group flex items-center gap-3 rounded-lg border border-fd-border p-4 transition-colors hover:bg-fd-accent"
        >
          <ArrowLeft className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:-translate-x-0.5" />
          <div className="min-w-0">
            <div className="text-xs text-fd-muted-foreground">Previous</div>
            <div className="truncate text-sm font-medium text-fd-foreground">
              {prevLabel}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {nextHref ? (
        <Link
          href={nextHref}
          className="group flex items-center justify-end gap-3 rounded-lg border border-fd-border p-4 text-right transition-colors hover:bg-fd-accent"
        >
          <div className="min-w-0">
            <div className="text-xs text-fd-muted-foreground">Next</div>
            <div className="truncate text-sm font-medium text-fd-foreground">
              {nextLabel}
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
