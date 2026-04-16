"use client"

import { useEffect } from "react"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])


  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-fd-muted-foreground text-sm font-mono">500</p>
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-fd-muted-foreground max-w-sm text-sm">
        An unexpected error occurred. Please try again or return to the docs.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-fd-primary text-fd-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/course"
          className="border-fd-border rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
        >
          Go to docs
        </Link>
      </div>
    </div>
  )
}
