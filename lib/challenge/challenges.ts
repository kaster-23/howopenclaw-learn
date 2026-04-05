export interface Challenge {
  id: string
  num: number
  xp: number
  achievement: string
  label: string
  href: string
  next: string | null
}

export const CHALLENGES: Challenge[] = [
  { id: "install", num: 1, xp: 150, achievement: "Up & Running",      label: "Install", href: "/challenge/install", next: "/challenge/deploy"   },
  { id: "deploy",  num: 2, xp: 250, achievement: "Always Online",     label: "Deploy",  href: "/challenge/deploy",  next: "/challenge/execute"  },
  { id: "execute", num: 3, xp: 350, achievement: "First Strike",      label: "Execute", href: "/challenge/execute", next: "/challenge/complete" },
]

export const TOTAL_XP = 750
export const STORAGE_KEY = "challenge-openclaw-progress"

export function getCompleted(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw).completed ?? []) : []
  } catch {
    return []
  }
}

export function markComplete(challengeId: string): string[] {
  const prev = getCompleted()
  if (prev.includes(challengeId)) return prev
  const next = [...prev, challengeId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: next }))
  return next
}

export function calcXP(completed: string[]): number {
  return CHALLENGES.filter((c) => completed.includes(c.id)).reduce((sum, c) => sum + c.xp, 0)
}

export function currentLabel(completed: string[]): string {
  const last = [...CHALLENGES].reverse().find((c) => completed.includes(c.id))
  return last?.achievement ?? "Not started"
}
