"use client"

import { useEffect, useRef, useState } from "react"

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "default",
          fontFamily: "var(--font-geist-sans)",
        })

        if (cancelled) return

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
        const { svg } = await mermaid.render(id, chart)

        if (!cancelled && el) {
          el.innerHTML = svg
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to render diagram")
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
        Diagram error: {error}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="not-prose my-6 flex justify-center [&_svg]:max-w-full"
      aria-label="Diagram"
    />
  )
}
