"use client"

import { useState } from "react"
import Link from "next/link"
import { MISSIONS, TOTAL_XP, calcXP, markComplete, getCompleted } from "@/lib/how/missions"

interface ClaimXPProps {
  missionId: string
}

export function ClaimXP({ missionId }: ClaimXPProps) {
  const mission = MISSIONS.find((m) => m.id === missionId)
  const [completed, setCompleted] = useState<string[]>(getCompleted)
  const [justClaimed, setJustClaimed] = useState(false)

  if (!mission) return null

  const isDone = completed.includes(missionId)
  const xpAfter = calcXP(isDone ? completed : [...completed, missionId])
  const pct = Math.round((xpAfter / TOTAL_XP) * 100)

  function claim() {
    const next = markComplete(missionId)
    setCompleted(next)
    setJustClaimed(true)
  }

  if (isDone || justClaimed) {
    const nextLabel =
      mission.next === "/how/certificate"
        ? "Claim Commander Certificate"
        : `Start Mission ${String(mission.num + 1).padStart(2, "0")}`

    return (
      <div
        className="not-prose my-8 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)",
          border: "1px solid #22c55e55",
          boxShadow: "0 0 40px #22c55e22, 0 0 0 1px #22c55e33",
        }}
      >
        {/* Top bar */}
        <div
          className="px-5 py-2 flex items-center gap-2"
          style={{ background: "#22c55e18", borderBottom: "1px solid #22c55e33" }}
        >
          <span style={{ color: "#22c55e", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>
            ✓ MISSION {String(mission.num).padStart(2, "0")} COMPLETE
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Achievement + rank row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p style={{ color: "#86efac", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 4 }}>
                ACHIEVEMENT UNLOCKED
              </p>
              <p style={{ color: "#ffffff", fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
                {mission.achievement}
              </p>
            </div>
            <div
              className="shrink-0 rounded-lg px-3 py-2 text-center"
              style={{ background: "#22c55e22", border: "1px solid #22c55e44" }}
            >
              <p style={{ color: "#86efac", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.1em" }}>RANK</p>
              <p style={{ color: "#4ade80", fontSize: 13, fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                {mission.rank}
              </p>
            </div>
          </div>

          {/* XP progress bar */}
          <div className="mb-5">
            <div className="flex justify-between mb-1.5" style={{ fontSize: 11, fontFamily: "monospace" }}>
              <span style={{ color: "#86efac" }}>+{mission.xp} XP EARNED</span>
              <span style={{ color: "#4ade80", fontWeight: 700 }}>{xpAfter} / {TOTAL_XP} XP</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 8, background: "#052e16", border: "1px solid #22c55e33" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #16a34a, #4ade80)",
                  boxShadow: "0 0 8px #4ade8088",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>

          {/* Next mission CTA */}
          {mission.next && (
            <Link
              href={mission.next}
              className="flex items-center justify-between rounded-lg px-4 py-3 transition-all"
              style={{
                background: "#22c55e",
                color: "#052e16",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#16a34a" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#22c55e" }}
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
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
      }}
    >
      <div className="p-5">
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
          Finished all the steps? Mark this mission complete to claim your XP and unlock the next mission.
        </p>

        {/* XP preview */}
        <div
          className="rounded-lg p-3 mb-4 flex items-center gap-3"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          <div
            className="rounded-md w-10 h-10 flex items-center justify-center shrink-0"
            style={{ background: "#22c55e18", border: "1px solid #22c55e33" }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
          </div>
          <div>
            <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 14 }}>+{mission.xp} XP</p>
            <p style={{ color: "#64748b", fontSize: 12 }}>Rank: <span style={{ color: "#94a3b8" }}>{mission.rank}</span></p>
          </div>
        </div>

        <button
          onClick={claim}
          className="w-full rounded-lg py-3 font-bold text-sm transition-all cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "#ffffff",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 0 20px #22c55e33",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px #22c55e66" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #22c55e33" }}
        >
          ✓ I completed this mission — Claim +{mission.xp} XP
        </button>
      </div>
    </div>
  )
}
