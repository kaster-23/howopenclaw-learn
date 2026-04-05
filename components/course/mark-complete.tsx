"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import {
  getCompleted,
  markComplete,
  markIncomplete,
  STORAGE_KEY,
} from "@/lib/course/progress"

interface MarkCompleteProps {
  moduleId: string
}

export function MarkComplete({ moduleId }: MarkCompleteProps) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    function update() {
      setDone(getCompleted().includes(moduleId))
    }

    update()

    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY || e.key === null) update()
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [moduleId])

  function toggle() {
    if (done) {
      markIncomplete(moduleId)
      setDone(false)
    } else {
      markComplete(moduleId)
      setDone(true)
    }
  }

  return (
    <div className="not-prose mt-10 border-t border-fd-border pt-6">
      <button
        type="button"
        onClick={toggle}
        className="group flex items-center gap-3 rounded-lg border border-fd-border px-4 py-3 text-sm transition-colors hover:bg-fd-accent"
        aria-pressed={done}
      >
        <span
          className={`flex size-5 items-center justify-center rounded border transition-colors ${
            done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-fd-muted-foreground/40 text-transparent group-hover:border-fd-muted-foreground"
          }`}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <span className="text-fd-foreground">
          {done ? "Completed" : "Mark this module as complete"}
        </span>
      </button>
    </div>
  )
}
