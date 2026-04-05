"use client"

import { useEffect, useState } from "react"
import { getProgressPercent, getCompleted, TOTAL_MODULES, STORAGE_KEY } from "@/lib/course/progress"

export function CourseProgress() {
  const [percent, setPercent] = useState(0)
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    function update() {
      setPercent(getProgressPercent())
      setCompleted(getCompleted().length)
    }

    update()

    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY || e.key === null) update()
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <div className="not-prose my-6">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-fd-muted-foreground">
          {completed} of {TOTAL_MODULES} modules complete
        </span>
        <span className="font-medium text-fd-foreground">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-fd-muted">
        <div
          className="h-full rounded-full bg-fd-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Course progress: ${percent}% complete`}
        />
      </div>
    </div>
  )
}
