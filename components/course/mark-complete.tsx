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
        className={`mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-200 ${
          done
            ? "bg-emerald-600 border border-emerald-600 text-white"
            : "border border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-emerald-500/15 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
        }`}
      >
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
            done
              ? "border-white bg-white/20 text-white"
              : "border-current text-transparent"
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
