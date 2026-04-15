import Link from "next/link"

export function SidebarBanner() {
  return (
    <Link
      href="/course"
      className="mx-2 mb-1 flex items-center justify-between rounded-lg border border-fd-border/60 bg-fd-accent/30 px-3 py-2 text-xs transition-colors hover:bg-fd-accent/50"
    >
      <span className="font-medium text-fd-foreground">Course</span>
      <span className="text-fd-muted-foreground">10 modules · ~1 hr</span>
    </Link>
  )
}
