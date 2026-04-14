"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MISSIONS, TOTAL_XP, STORAGE_KEY, calcXP, currentRank, getCompleted } from "@/lib/how/missions"

export function MissionProgress() {
  const [completed, setCompleted] = useState<string[]>(getCompleted)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCompleted(getCompleted())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const xp = calcXP(completed)
  const rank = currentRank(completed)
  const pct = Math.round((xp / TOTAL_XP) * 100)
  const nextMission = MISSIONS.find((m) => !completed.includes(m.id))
  const allDone = completed.length === 7

  return (
    <div
      className="not-prose my-6 rounded-xl overflow-hidden"
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: "#1e293b", borderBottom: "1px solid #334155" }}
      >
        <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.12em" }}>
          MISSION PROGRESS
        </span>
        <span style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>
          {completed.length} / 7 COMPLETE
        </span>
      </div>

      <div className="p-5">
        {/* Rank + XP row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 2 }}>
              CURRENT RANK
            </p>
            <p style={{ color: "#f8fafc", fontSize: 20, fontWeight: 800 }}>{rank}</p>
          </div>
          <div className="text-right">
            <p style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 2 }}>
              TOTAL XP
            </p>
            <p style={{ color: "#f8fafc", fontSize: 20, fontWeight: 800 }}>
              {xp.toLocaleString()}
              <span style={{ color: "#475569", fontSize: 14, fontWeight: 400 }}> / {TOTAL_XP.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div
            className="rounded-full overflow-hidden"
            style={{ height: 10, background: "#1e293b", border: "1px solid #334155" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: xp === 0
                  ? "transparent"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                boxShadow: xp > 0 ? "0 0 10px #8b5cf666" : "none",
                transition: "width 1s ease",
                minWidth: xp > 0 ? 8 : 0,
              }}
            />
          </div>
        </div>

        {/* Mission dots */}
        <div className="flex gap-2 mb-5">
          {MISSIONS.map((m) => {
            const done = completed.includes(m.id)
            const isNext = !done && completed.length === m.num - 1
            return (
              <Link
                key={m.id}
                href={m.href}
                title={`Mission ${m.num}: ${m.label}`}
                className="flex-1 rounded flex flex-col items-center gap-1 py-2 transition-all"
                style={{
                  background: done ? "#22c55e18" : isNext ? "#1e293b" : "#0f172a",
                  border: done
                    ? "1px solid #22c55e44"
                    : isNext
                    ? "1px solid #3b82f644"
                    : "1px solid #1e293b",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: 14 }}>
                  {done ? "✓" : isNext ? "▶" : "·"}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: done ? "#4ade80" : isNext ? "#60a5fa" : "#475569",
                    letterSpacing: "0.05em",
                  }}
                >
                  M{String(m.num).padStart(2, "0")}
                </span>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        {allDone ? (
          <Link
            href="/how/certificate"
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{
              background: "linear-gradient(135deg, #052e16, #14532d)",
              border: "1px solid #22c55e44",
              color: "#4ade80",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            <span>🏆 Claim Commander Certificate</span>
            <span>→</span>
          </Link>
        ) : nextMission ? (
          <Link
            href={nextMission.href}
            className="flex items-center justify-between rounded-lg px-4 py-3"
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            <span>
              {completed.length === 0 ? "Start Mission 01: First Contact" : `Continue: ${nextMission.label}`}
            </span>
            <span style={{ color: "#64748b" }}>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  )
}
