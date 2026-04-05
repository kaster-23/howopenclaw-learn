export interface Mission {
  id: string
  num: number
  xp: number
  achievement: string
  rank: string
  label: string
  href: string
  next: string | null
}

export const MISSIONS: Mission[] = [
  { id: "mission-01", num: 1, xp: 100, achievement: "First Contact",    rank: "Operator",          label: "First Contact",    href: "/how/mission-01", next: "/how/mission-02" },
  { id: "mission-02", num: 2, xp: 150, achievement: "Soul Architect",   rank: "Field Agent",        label: "Soul Architect",   href: "/how/mission-02", next: "/how/mission-03" },
  { id: "mission-03", num: 3, xp: 150, achievement: "Signal Corps",     rank: "Field Agent II",     label: "Signal Corps",     href: "/how/mission-03", next: "/how/mission-04" },
  { id: "mission-04", num: 4, xp: 200, achievement: "Clockwork",        rank: "Specialist",         label: "Clockwork",        href: "/how/mission-04", next: "/how/mission-05" },
  { id: "mission-05", num: 5, xp: 200, achievement: "Augmented",        rank: "Senior Specialist",  label: "Augmented",        href: "/how/mission-05", next: "/how/mission-06" },
  { id: "mission-06", num: 6, xp: 250, achievement: "Intelligence",     rank: "Agent",              label: "Intelligence",     href: "/how/mission-06", next: "/how/mission-07" },
  { id: "mission-07", num: 7, xp: 300, achievement: "Commander",        rank: "Commander",          label: "Commander",        href: "/how/mission-07", next: "/how/certificate" },
]

export const TOTAL_XP = 1350
export const STORAGE_KEY = "how-openclaw-progress"

export function getCompleted(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw).completed ?? []) : []
  } catch {
    return []
  }
}

export function markComplete(missionId: string): string[] {
  const prev = getCompleted()
  if (prev.includes(missionId)) return prev
  const next = [...prev, missionId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: next }))
  return next
}

export function calcXP(completed: string[]): number {
  return MISSIONS.filter((m) => completed.includes(m.id)).reduce((sum, m) => sum + m.xp, 0)
}

export function currentRank(completed: string[]): string {
  const last = [...MISSIONS].reverse().find((m) => completed.includes(m.id))
  return last?.rank ?? "Recruit"
}
