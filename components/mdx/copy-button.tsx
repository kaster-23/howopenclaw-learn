"use client"

import { useState } from "react"
import { Check, Clipboard } from "lucide-react"

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="absolute right-2 top-2 flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-background/80 px-3 py-2.5 text-xs text-fd-muted-foreground backdrop-blur-sm transition-colors hover:bg-fd-accent hover:text-fd-foreground min-h-[44px]"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-500" />
          <span className="text-emerald-500">Copied</span>
        </>
      ) : (
        <>
          <Clipboard className="size-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}
