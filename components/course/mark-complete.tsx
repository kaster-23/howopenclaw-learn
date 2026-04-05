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
    <div className="not-prose mt-12 border-t border-fd-border pt-8 text-center">
      {!done && (
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">
          Finished this module?
        </p>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={done}
        className={`group mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-xl border-2 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
          done
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-[var(--color-fd-primary)]/30 bg-[var(--color-fd-primary)]/5 text-fd-foreground hover:border-[var(--color-fd-primary)] hover:bg-[var(--color-fd-primary)]/10"
        }`}
      >
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-current text-transparent group-hover:text-current"
          }`}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <span>
          {done ? "Module complete — great work!" : "Mark this module as complete"}
        </span>
      </button>
      {!done && (
        <p className="mt-3 text-xs text-fd-muted-foreground">
          Tracks your progress across all 10 modules
        </p>
      )}
    </div>
  )
}
