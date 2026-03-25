"use client"

import { useEffect } from "react"

export function ThemeTransition() {
  useEffect(() => {
    const html = document.documentElement
    let isDark = html.classList.contains("dark")

    const observer = new MutationObserver(() => {
      const nowDark = html.classList.contains("dark")
      if (nowDark === isDark) return // ignore non-theme class changes
      isDark = nowDark

      // Temporarily disconnect to avoid loop when we modify class
      observer.disconnect()
      html.classList.add("theme-transitioning")
      setTimeout(() => {
        html.classList.remove("theme-transitioning")
        // Reconnect after cleanup
        observer.observe(html, { attributes: true, attributeFilter: ["class"] })
      }, 125)
    })

    observer.observe(html, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return null
}
