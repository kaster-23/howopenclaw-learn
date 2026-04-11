import fs from "fs"
import path from "path"

/**
 * The current OpenClaw release version, read from .openclaw-last-version.
 * Updated automatically by the GitHub Actions sync workflow.
 * Use the <OpenClawVersion /> MDX component or this constant in code.
 */
export const OPENCLAW_VERSION: string = (() => {
  try {
    return fs
      .readFileSync(path.resolve(process.cwd(), ".openclaw-last-version"), "utf8")
      .trim()
  } catch {
    return "v2026.4.10" // fallback if file is missing
  }
})()
