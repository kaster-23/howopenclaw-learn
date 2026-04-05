"use client"

import { useEffect } from "react"

export function Fireworks() {
  useEffect(() => {
    let cancelled = false

    async function run() {
      const confetti = (await import("canvas-confetti")).default

      const colors = ["#22c55e", "#4ade80", "#86efac", "#ffffff", "#fbbf24", "#a78bfa", "#f472b6"]

      function burst(origin: { x: number; y: number }, angle: number) {
        if (cancelled) return
        confetti({
          particleCount: 50,
          angle,
          spread: 70,
          startVelocity: 55,
          origin,
          colors,
          ticks: 250,
          gravity: 0.9,
          scalar: 1.1,
        })
      }

      // First wave — sides
      burst({ x: 0.1, y: 0.7 }, 60)
      burst({ x: 0.9, y: 0.7 }, 120)

      await delay(600)
      if (cancelled) return

      // Center explosion
      confetti({
        particleCount: 150,
        spread: 120,
        startVelocity: 50,
        origin: { x: 0.5, y: 0.45 },
        colors,
        ticks: 350,
        gravity: 0.75,
        scalar: 1.2,
      })

      await delay(700)
      if (cancelled) return

      // Second wave — sides again
      burst({ x: 0.15, y: 0.65 }, 70)
      burst({ x: 0.85, y: 0.65 }, 110)

      await delay(600)
      if (cancelled) return

      // Final shower from top
      confetti({
        particleCount: 80,
        spread: 80,
        startVelocity: 30,
        origin: { x: 0.5, y: 0.1 },
        colors,
        ticks: 400,
        gravity: 1,
        scalar: 0.9,
      })
    }

    const timer = setTimeout(() => run(), 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return null
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
