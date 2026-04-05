export const STORAGE_KEY = "openclaw-course-progress"

export const TOTAL_MODULES = 10

export const MODULE_IDS = [
  "0-setup",
  "1-architecture",
  "2-connecting-apps",
  "3-skills-tools",
  "4-prompts",
  "5-memory-personality",
  "6-autonomous-tasks",
  "7-projects",
  "8-security-ethics",
  "9-next-steps",
] as const

export type ModuleId = (typeof MODULE_IDS)[number]

export function getCompleted(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as { completed: string[] }
    return Array.isArray(data.completed) ? data.completed : []
  } catch {
    return []
  }
}

export function markComplete(moduleId: string): string[] {
  const completed = getCompleted()
  if (completed.includes(moduleId)) return completed
  const updated = [...completed, moduleId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: updated }))
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }))
  return updated
}

export function markIncomplete(moduleId: string): string[] {
  const completed = getCompleted().filter((id) => id !== moduleId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed }))
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }))
  return completed
}

export function getProgressPercent(): number {
  const completed = getCompleted()
  const validCount = completed.filter((id) => (MODULE_IDS as readonly string[]).includes(id)).length
  return Math.round((validCount / TOTAL_MODULES) * 100)
}

export function getValidCompletedCount(): number {
  const completed = getCompleted()
  return completed.filter((id) => (MODULE_IDS as readonly string[]).includes(id)).length
}
