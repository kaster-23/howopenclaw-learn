import { OPENCLAW_VERSION } from "@/lib/openclaw-version"

/**
 * Renders the current OpenClaw version string inline.
 * Source of truth: .openclaw-last-version (updated by GitHub Actions sync).
 *
 * Usage in MDX:
 *   As of <OpenClawVersion />, this feature...
 *   ## Recent improvements (<OpenClawVersion />)
 */
export function OpenClawVersion() {
  return <>{OPENCLAW_VERSION}</>
}
