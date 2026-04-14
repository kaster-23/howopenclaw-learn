"use client"

import { useState } from "react"
import Link from "next/link"
import { CHALLENGES, TOTAL_XP, calcXP, markComplete, getCompleted } from "@/lib/challenge/challenges"

interface ChallengeClaimXPProps {
  challengeId: string
}

export function ChallengeClaimXP({ challengeId }: ChallengeClaimXPProps) {
  const challenge = CHALLENGES.find((c) => c.id === challengeId)
  const [completed, setCompleted] = useState<string[]>(getCompleted)
  const [justClaimed, setJustClaimed] = useState(false)

  if (!challenge) return null

  const isDone = completed.includes(challengeId)
  const xpAfter = calcXP(isDone ? completed : [...completed, challengeId])
  const pct = Math.round((xpAfter / TOTAL_XP) * 100)

  function claim() {
    const next = markComplete(challengeId)
    setCompleted(next)
    setJustClaimed(true)
  }

  if (isDone || justClaimed) {
    const nextLabel =
      challenge.next === "/challenge/complete"
        ? "Claim Your Certificate"
        : `Start Challenge ${challenge.num + 1}`

    return (
      <div
        className="not-prose my-8 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1c1008 0%, #3b1a00 50%, #1c1008 100%)",
          border: "1px solid #f59e0b55",
          boxShadow: "0 0 40px #f59e0b22, 0 0 0 1px #f59e0b33",
        }}
      >
        {/* Top bar */}
        <div
          className="px-5 py-2 flex items-center gap-2"
          style={{ background: "#f59e0b18", borderBottom: "1px solid #f59e0b33" }}
        >
          <span style={{ color: "#f59e0b", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>
            ✓ CHALLENGE {challenge.num} COMPLETE
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Achievement row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p style={{ color: "#fde68a", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 4 }}>
                ACHIEVEMENT UNLOCKED
              </p>
              <p style={{ color: "#ffffff", fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
                {challenge.achievement}
              </p>
            </div>
            <div
              className="shrink-0 rounded-lg px-3 py-2 text-center"
              style={{ background: "#f59e0b22", border: "1px solid #f59e0b44" }}
            >
              <p style={{ color: "#fde68a", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.1em" }}>XP</p>
              <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>
                +{challenge.xp}
              </p>
            </div>
          </div>

          {/* XP progress bar */}
          <div className="mb-5">
            <div className="flex justify-between mb-1.5" style={{ fontSize: 11, fontFamily: "monospace" }}>
              <span style={{ color: "#fde68a" }}>+{challenge.xp} XP EARNED</span>
              <span style={{ color: "#fbbf24", fontWeight: 700 }}>{xpAfter} / {TOTAL_XP} XP</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 8, background: "#1c1008", border: "1px solid #f59e0b33" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #d97706, #f97316)",
                  boxShadow: "0 0 8px #f9731688",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>

          {/* Next CTA */}
          {challenge.next && (
            <Link
              href={challenge.next}
              className="flex items-center justify-between rounded-lg px-4 py-3 transition-all"
              style={{
                background: "#f59e0b",
                color: "#1c1008",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#d97706" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#f59e0b" }}
            >
              <span>{nextLabel}</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    )
  }

  // Unclaimed state
  return (
    <div
      className="not-prose my-8 rounded-xl overflow-hidden"
      style={{ background: "#0f172a", border: "1px solid #334155" }}
    >
      <div className="p-5">
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
          Finished all the steps? Mark this challenge complete to claim your XP and move to the next one.
        </p>

        {/* XP preview */}
        <div
          className="rounded-lg p-3 mb-4 flex items-center gap-3"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <div
            className="rounded-md w-10 h-10 flex items-center justify-center shrink-0"
            style={{ background: "#f59e0b18", border: "1px solid #f59e0b33" }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
          </div>
          <div>
            <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 14 }}>+{challenge.xp} XP</p>
            <p style={{ color: "#64748b", fontSize: 12 }}>
              Achievement: <span style={{ color: "#94a3b8" }}>{challenge.achievement}</span>
            </p>
          </div>
        </div>

        <button
          onClick={claim}
          className="w-full rounded-lg py-3 font-bold text-sm transition-all cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            color: "#1c1008",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 0 20px #f59e0b33",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px #f59e0b66" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #f59e0b33" }}
        >
          ✓ Challenge complete — Claim +{challenge.xp} XP
        </button>
      </div>
    </div>
  )
}
