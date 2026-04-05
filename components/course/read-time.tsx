import { Clock } from "lucide-react"

interface ReadTimeProps {
  minutes: number
}

export function ReadTime({ minutes }: ReadTimeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
      <Clock className="size-3.5" aria-hidden="true" />
      {minutes} min read
    </span>
  )
}
