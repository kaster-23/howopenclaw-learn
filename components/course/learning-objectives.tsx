import { Target } from "lucide-react"

interface LearningObjectivesProps {
  objectives: string[]
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-fd-foreground">
        <Target className="size-4" aria-hidden="true" />
        What you will learn
      </div>
      <ul className="space-y-2">
        {objectives.map((obj) => (
          <li
            key={obj}
            className="flex items-start gap-2 text-sm text-fd-muted-foreground"
          >
            <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-fd-primary" />
            {obj}
          </li>
        ))}
      </ul>
    </div>
  )
}
