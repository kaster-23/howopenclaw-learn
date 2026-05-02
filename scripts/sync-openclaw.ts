/**
 * sync-openclaw.ts
 *
 * Two-phase doc sync, both phases on Haiku:
 *   Phase 1 — triage release notes → identify affected files + what to change
 *   Phase 2 — execute the plan → read targeted files, write updates
 *
 * Quality is verified by the workflow's lint + build steps after this script
 * runs, so a separate audit phase is unnecessary.
 *
 * Run via GitHub Actions on a schedule, or locally:
 *   ANTHROPIC_API_KEY=sk-... pnpm tsx scripts/sync-openclaw.ts
 */

import Anthropic from "@anthropic-ai/sdk"
import fs from "fs"
import path from "path"

const client = new Anthropic()

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const VERSION_FILE = path.resolve(process.cwd(), ".openclaw-last-version")
const OPENCLAW_REPO = "OpenClaw/OpenClaw"

// Both phases run on Haiku — the writer was previously Sonnet, but writes are
// short and structured; lint + build catches anything broken in CI.
const MODEL_TRIAGE = "claude-haiku-4-5-20251001"
const MODEL_WRITER = "claude-haiku-4-5-20251001"

// Token caps: triage outputs are short (file lists), writes are per-file MDX.
// 2048 is comfortable for both and prevents runaway responses.
const MAX_TOKENS = 2048

// Iteration caps: hard ceiling on tool-loop cost. Raise if a release legitimately
// touches more than ~10 files. Triage was raised 8 → 12 because large releases
// (e.g. v2026.4.29) require the agent to read many files (concepts, channels,
// CLI, security) before it can commit to a plan. Writer is now per-file (no
// shared loop), so MAX_ITER_WRITER is the cap per single-file call. Started at
// 4, but real run on v2026.4.29 showed Haiku consistently hits 4 before
// writing — needs read → reason → maybe re-check → write → confirm. 8 gives
// comfortable headroom; tight per-file budget (60k) still bounds the cost.
const MAX_ITER_TRIAGE = 12
const MAX_ITER_WRITER = 8

// Token budget per loop. Input tokens compound quadratically because every
// iteration resends the full history (file reads + assistant responses + tool
// results). Without a budget cap, a chatty writer can balloon to 500k+ tokens
// on a multi-file release. Calibrated from a real run that used ~511k.
// Triage was raised 80k → 200k → 400k after large releases (v2026.4.29)
// kept blowing the budget while still doing legitimate work — reading many
// docs files before committing to a plan. Haiku is cheap (~$1/M input) and
// the cost of missing a doc-relevant change is much higher than a few
// extra tokens. Writer is now per-file: each call gets a tight 60k budget
// (file content + changes block + a couple iters of writing). One large
// shared-loop writer was unreliable on big releases — Haiku spent 14 iters
// reading without writing on v2026.4.29.
const TOKEN_BUDGET_TRIAGE = 400_000
const TOKEN_BUDGET_WRITER = 60_000

// Track total token usage across all calls — printed at end of run.
let totalInputTokens = 0
let totalOutputTokens = 0

// Track every file written by safeWrite during this run — authoritative source
// of truth for "which files did the writer touch?", as opposed to parsing the
// model's final text (which doesn't emit if the loop hits max_iter).
const filesWritten = new Set<string>()

// ─── GitHub helpers ──────────────────────────────────────────────────────────

async function getLatestRelease(): Promise<{ tag: string; notes: string } | null> {
  // /releases/latest returns the latest stable, non-prerelease, non-draft release.
  // We track stable only so the site matches the official OpenClaw docs and
  // doesn't ship experimental beta features that might never land in stable
  // (e.g. a beta channel card pointing to a page that doesn't exist).
  const res = await fetch(
    `https://api.github.com/repos/${OPENCLAW_REPO}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
      },
    }
  )
  if (!res.ok) {
    console.log(`GitHub API returned ${res.status} — no stable release or rate limited`)
    return null
  }
  const release = await res.json() as { tag_name: string; body?: string }
  return { tag: release.tag_name, notes: release.body ?? "" }
}

// ─── Version tracking ─────────────────────────────────────────────────────────

function getLastKnownVersion(): string {
  try {
    return fs.readFileSync(VERSION_FILE, "utf8").trim()
  } catch {
    return ""
  }
}

function saveVersion(version: string) {
  fs.writeFileSync(VERSION_FILE, version, "utf8")
}

// ─── File helpers ─────────────────────────────────────────────────────────────

function listMdxFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listMdxFiles(full))
    } else if (entry.name.endsWith(".mdx")) {
      files.push(path.relative(process.cwd(), full))
    }
  }
  return files.sort()
}

function safeRead(filePath: string): string {
  const resolved = path.resolve(process.cwd(), filePath)
  if (!resolved.startsWith(CONTENT_DIR)) return "Error: path outside content directory"
  try {
    return fs.readFileSync(resolved, "utf8")
  } catch {
    return `Error: file not found — ${filePath}`
  }
}

function safeWrite(filePath: string, content: string): string {
  const resolved = path.resolve(process.cwd(), filePath)
  if (!resolved.startsWith(CONTENT_DIR)) return "Error: path outside content directory"
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, content, "utf8")
  filesWritten.add(filePath)
  console.log(`  ✏️  Updated: ${filePath}`)
  return `Updated: ${filePath}`
}

// ─── GitHub Actions output ───────────────────────────────────────────────────

function setOutput(name: string, value: string) {
  const file = process.env.GITHUB_OUTPUT
  if (file) {
    fs.appendFileSync(file, `${name}<<EOF\n${value}\nEOF\n`)
  }
  console.log(`[output] ${name}=${value.slice(0, 80)}`)
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const readOnlyTools: Anthropic.Tool[] = [
  {
    name: "list_docs",
    description: "List all documentation .mdx files available in the content directory",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "read_file",
    description: "Read the contents of a documentation .mdx file",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Relative path from project root, e.g. content/channels/telegram.mdx",
        },
      },
      required: ["path"],
    },
  },
]

const writeTools: Anthropic.Tool[] = [
  ...readOnlyTools,
  {
    name: "write_file",
    description: "Write updated content to a documentation .mdx file. Only call this when changes are actually needed.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Relative path from project root" },
        content: { type: "string", description: "Full updated file content (preserve frontmatter and MDX components)" },
      },
      required: ["path", "content"],
    },
  },
]

function executeTool(name: string, input: Record<string, string>): string {
  switch (name) {
    case "list_docs":
      return listMdxFiles(CONTENT_DIR).join("\n")
    case "read_file":
      return safeRead(input.path)
    case "write_file":
      if (!input.content) return "Error: content is required for write_file"
      return safeWrite(input.path, input.content)
    default:
      return `Unknown tool: ${name}`
  }
}

// ─── Model call with retry + credit-balance handling ─────────────────────────

interface ApiErrorShape {
  status?: number
  error?: { error?: { type?: string; message?: string } }
  message?: string
}

function isCreditBalanceError(err: unknown): boolean {
  const e = err as ApiErrorShape
  const msg = e?.error?.error?.message ?? e?.message ?? ""
  return typeof msg === "string" && msg.toLowerCase().includes("credit balance is too low")
}

function isRetryableError(err: unknown): boolean {
  const e = err as ApiErrorShape
  // 5xx and 429 are transient. 4xx (other than 429) are not.
  return e?.status === 429 || (typeof e?.status === "number" && e.status >= 500)
}

async function createMessageWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
): Promise<Anthropic.Message> {
  try {
    return await client.messages.create(params)
  } catch (err) {
    if (isCreditBalanceError(err)) {
      console.error(
        "\n💳 Anthropic API credit balance is too low. Top up at " +
          "https://console.anthropic.com/settings/billing — this is not a code bug.",
      )
      process.exit(2)
    }
    if (isRetryableError(err)) {
      console.warn("  Transient API error, retrying once after 1s…")
      await new Promise((r) => setTimeout(r, 1000))
      return await client.messages.create(params)
    }
    throw err
  }
}

// ─── Agentic loop ─────────────────────────────────────────────────────────────

type LoopResult = {
  text: string
  // 'clean' = model called end_turn or finished without tools
  // 'budget' / 'max_iter' = forced termination, output may be incomplete
  stopped: "clean" | "budget" | "max_iter"
}

async function runAgentLoop(
  model: string,
  system: string,
  userMessage: string,
  tools: Anthropic.Tool[],
  maxIter: number,
  label: string,
  loopTokenBudget?: number,
): Promise<LoopResult> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ]

  let lastText = ""
  let loopInputTokens = 0
  let stopped: LoopResult["stopped"] = "max_iter"

  for (let i = 0; i < maxIter; i++) {
    const response = await createMessageWithRetry({
      model,
      max_tokens: MAX_TOKENS,
      system,
      tools,
      messages,
    })

    loopInputTokens += response.usage.input_tokens
    totalInputTokens += response.usage.input_tokens
    totalOutputTokens += response.usage.output_tokens

    messages.push({ role: "assistant", content: response.content })

    // Collect any text output
    for (const block of response.content) {
      if (block.type === "text") lastText = block.text
    }

    if (response.stop_reason === "end_turn") {
      console.log(`  [${label}] finished after ${i + 1} iter`)
      stopped = "clean"
      break
    }

    const toolCalls = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    )
    if (toolCalls.length === 0) {
      stopped = "clean"
      break
    }

    const results: Anthropic.ToolResultBlockParam[] = toolCalls.map((tool) => ({
      type: "tool_result",
      tool_use_id: tool.id,
      content: executeTool(tool.name, tool.input as Record<string, string>),
    }))

    messages.push({ role: "user", content: results })

    // Hard budget cap — input tokens compound each iter (full history resent),
    // so a chatty writer can balloon to 500k+ on a multi-file release. Stop the
    // loop early if we've exceeded the budget.
    if (loopTokenBudget && loopInputTokens > loopTokenBudget) {
      console.warn(
        `  [${label}] hit token budget (${loopInputTokens.toLocaleString()} > ${loopTokenBudget.toLocaleString()}) — stopping after iter ${i + 1}`,
      )
      stopped = "budget"
      break
    }

    if (i === maxIter - 1) {
      console.warn(`  [${label}] hit max_iter (${maxIter}) — stopping`)
    }
  }

  return { text: lastText, stopped }
}

// ─── Phase 1: Haiku triage ────────────────────────────────────────────────────

async function triageRelease(
  releaseTag: string,
  releaseNotes: string,
  lastVersion: string,
): Promise<LoopResult> {
  console.log(`\n[Phase 1 — Haiku] Triaging release ${releaseTag}...`)

  const system = `You are a triage assistant for HowOpenClaw, an educational site about OpenClaw.

The site has these doc files:
- content/course/       — 10-module course (0-setup through 9-next-steps)
- content/channels/     — per-channel setup guides (telegram, slack, discord, whatsapp, imessage, signal, teams, webchat)
- content/reference/    — CLI reference, concepts, troubleshooting, pricing, system-requirements, what-is-openclaw

Your job: given a release's changelog, identify which doc files need updating and what specifically to change in each.

**Always flag for update when the release contains any of these:**
- **Breaking config changes** — anything that changes how users write \`openclaw.json\` (tool sections, profile behavior, channel config keys, security defaults). These typically affect content/reference/concepts.mdx and the relevant channel/course page.
- **New AI providers or models** — new provider integrations (e.g. NVIDIA, Bedrock variants), new default models, new model auth flows. Typically affect content/course/0-setup.mdx, content/reference/system-requirements.mdx, content/reference/pricing.mdx.
- **Channel changes** — bug fixes, new features, or removed features for any messaging channel (Slack, Telegram, Discord, WhatsApp, iMessage, Signal, Teams, Matrix, Feishu, webchat). Each affects its content/channels/<name>.mdx page. Even reliability/edge-case fixes are worth a brief note.
- **CLI command changes** — new commands, new flags, removed commands, output format changes. Affect content/reference/cli.mdx.
- **Security changes** — new defaults, new restrictions, advisory fixes. Affect content/course/8-security-ethics.mdx and content/reference/concepts.mdx.
- **Memory / automation / cron / skills features** — affect their respective course modules (5-memory-personality, 6-autonomous-tasks, 3-skills-tools).

**Skip only when:** the release is genuinely internal — pure refactors, dependency bumps, CI changes, release-tooling updates, or contributor-facing changes that don't surface in user behavior or config. When in doubt, flag it.

Be thorough but precise. Recall over precision: missing a doc-relevant change means the docs go stale; over-flagging just costs a few extra Haiku tokens. Output a structured plan.`

  const userMessage = `OpenClaw released **${releaseTag}** (previous: ${lastVersion || "unknown"}).

Release notes:
---
${releaseNotes || "(no release notes provided)"}
---

1. Call list_docs to see all available files
2. Read any files where you're uncertain about the current content
3. Output a triage plan as a markdown list with this format:

## Files to update

### content/path/to/file.mdx
**Reason:** (why this file needs updating)
**Changes needed:**
- (specific change 1)
- (specific change 2)

## Files with no changes needed
- content/path/file.mdx — (one-line reason)`

  return runAgentLoop(
    MODEL_TRIAGE,
    system,
    userMessage,
    readOnlyTools,
    MAX_ITER_TRIAGE,
    "triage",
    TOKEN_BUDGET_TRIAGE,
  )
}

// ─── Phase 2: writer ──────────────────────────────────────────────────────────

// Parse triage output into per-file work items. Triage is instructed to emit:
//   ## Files to update
//   ### content/path/to/file.mdx
//   **Reason:** ...
//   **Changes needed:**
//   - ...
//   - ...
//
//   ### content/another/file.mdx
//   ...
//
//   ## Files with no changes needed
//   - ...
function parseTriagePlan(triagePlan: string): { path: string; instructions: string }[] {
  const items: { path: string; instructions: string }[] = []
  const startIdx = triagePlan.indexOf("## Files to update")
  if (startIdx === -1) return items
  const endMarker = triagePlan.indexOf("## Files with no changes", startIdx)
  const section = triagePlan.slice(
    startIdx,
    endMarker === -1 ? triagePlan.length : endMarker,
  )
  // Split on "### " headers; first chunk is the section title, skip it.
  const chunks = section.split(/\n###\s+/).slice(1)
  for (const chunk of chunks) {
    const newlineIdx = chunk.indexOf("\n")
    const headerLine = (newlineIdx === -1 ? chunk : chunk.slice(0, newlineIdx)).trim()
    const body = newlineIdx === -1 ? "" : chunk.slice(newlineIdx + 1).trim()
    // Header may be just `content/x.mdx` or `content/x.mdx — reason`. Strip
    // backticks and anything after a separator.
    const filePath = headerLine
      .replace(/[`*]/g, "")
      .split(/\s+[—–-]\s+/)[0]
      .trim()
    if (filePath.startsWith("content/") && filePath.endsWith(".mdx")) {
      items.push({ path: filePath, instructions: body })
    }
  }
  return items
}

async function writeOneFile(
  releaseTag: string,
  filePath: string,
  instructions: string,
): Promise<{ written: boolean; stopped: LoopResult["stopped"] }> {
  const current = safeRead(filePath)
  if (current.startsWith("Error:")) {
    console.warn(`  ⚠️  Skipping ${filePath}: ${current}`)
    return { written: false, stopped: "clean" }
  }

  const system = `You are a technical documentation maintainer for HowOpenClaw, a course-based educational site for OpenClaw.

You will be given ONE file and ONE set of changes. Read the current content, apply the changes, and call write_file with the full updated content. Do not read other files. Do not skip the write step.

Rules:
- Preserve all existing MDX frontmatter and structure (faqs, howToSteps, readTime, moduleNumber, learningObjectives, prerequisites, nextModule, prevModule, title, description)
- Preserve all component syntax (Fumadocs: Callout, Steps, Step, Cards, Card, Tabs, Tab; course: ReadTime, LearningObjectives, ModuleNav, MarkComplete, VideoEmbed; Mermaid fenced blocks)
- Keep the same writing style and tone — calm, professional, beginner-friendly
- For new features added in this release, wrap them in: <Callout type="info" title="New in ${releaseTag}">...</Callout>
- For removed features, note the removal in a Callout
- Do not change moduleNumber, readTime, nextModule, prevModule, or moduleId values
- Make ONLY the changes listed in the instructions — do not refactor or rewrite unrelated sections
- If after reading the changes you decide they're not actually applicable to this file's current content, do NOT call write_file. Output a one-line explanation instead.`

  const userMessage = `File: \`${filePath}\`

Current content:
\`\`\`mdx
${current}
\`\`\`

Changes to apply (from triage):
${instructions}

Apply these changes and call write_file with the complete updated file content. Use write_file exactly once.`

  const result = await runAgentLoop(
    MODEL_WRITER,
    system,
    userMessage,
    writeTools,
    MAX_ITER_WRITER,
    `writer:${path.basename(filePath)}`,
    TOKEN_BUDGET_WRITER,
  )

  return { written: filesWritten.has(filePath), stopped: result.stopped }
}

async function executeUpdates(
  releaseTag: string,
  _releaseNotes: string,
  triagePlan: string,
): Promise<{ writtenFiles: string[]; stopped: LoopResult["stopped"] }> {
  const items = parseTriagePlan(triagePlan)
  console.log(
    `\n[Phase 2 — Haiku writer] Executing per-file updates for ${items.length} file(s)...`,
  )

  if (items.length === 0) {
    return { writtenFiles: [], stopped: "clean" }
  }

  const writtenFiles: string[] = []
  let anyForceStopped: LoopResult["stopped"] = "clean"

  for (const item of items) {
    console.log(`\n  → ${item.path}`)
    try {
      const { written, stopped } = await writeOneFile(
        releaseTag,
        item.path,
        item.instructions,
      )
      if (written) writtenFiles.push(item.path)
      // Track worst stop reason across all files for the caller's fail-loud
      // logic. A single force-stop on one file shouldn't tank the run, but we
      // surface it.
      if (stopped !== "clean" && anyForceStopped === "clean") {
        anyForceStopped = stopped
      }
    } catch (err) {
      console.error(`  ❌ Failed on ${item.path}:`, err)
      // Continue with the rest — partial sync is better than no sync.
    }
  }

  return { writtenFiles, stopped: anyForceStopped }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const release = await getLatestRelease()
  if (!release) {
    console.log("No release found — skipping.")
    setOutput("updated", "false")
    return
  }

  const lastVersion = getLastKnownVersion()

  if (lastVersion === release.tag) {
    console.log(`Docs already up to date with ${release.tag}`)
    setOutput("updated", "false")
    return
  }

  console.log(`\nNew release: ${release.tag} (previous: ${lastVersion || "none"})\n`)

  // Phase 1 — Haiku: cheap triage to identify what needs changing
  const triage = await triageRelease(release.tag, release.notes, lastVersion)
  console.log(`\nTriage plan:\n${triage.text}\n`)

  // If the triage loop was force-stopped (budget/max_iter), the output may be
  // empty or partial — we cannot trust the "no files to update" inference.
  // Fail loudly so the next run retries instead of silently bumping the
  // version and skipping a doc-relevant release. (Real bug we hit on
  // v2026.4.29 where the loop bailed at iter 3 on the original 80k budget.)
  if (triage.stopped !== "clean") {
    throw new Error(
      `Triage did not terminate cleanly (reason: ${triage.stopped}). ` +
        `Output may be incomplete. Refusing to bump version. ` +
        `Raise TOKEN_BUDGET_TRIAGE or MAX_ITER_TRIAGE if this recurs.`,
    )
  }

  // Check if anything actually needs updating
  if (!triage.text.includes("## Files to update") || triage.text.match(/## Files to update\s*\n\s*## /)) {
    console.log("Triage found no files to update — bumping version file only.")
    saveVersion(release.tag)
    // version_only=true tells the workflow to commit just the version file
    // (no lint/build needed, no doc changes). Without this, the bumped version
    // file is discarded with the runner and we re-triage the same release daily.
    setOutput("updated", "false")
    setOutput("version_only", "true")
    setOutput("version", release.tag)
    return
  }

  // Phase 2 — execute the triage plan (one Haiku call per file)
  const plannedItems = parseTriagePlan(triage.text)
  if (plannedItems.length === 0) {
    throw new Error(
      `Triage emitted "## Files to update" but the parser found no valid file entries. ` +
        `Triage output may be malformed. Refusing to bump version. Triage text:\n${triage.text.slice(0, 1000)}`,
    )
  }

  const { writtenFiles, stopped: writerStopped } = await executeUpdates(
    release.tag,
    release.notes,
    triage.text,
  )
  console.log(`\nUpdated ${writtenFiles.length} file(s): ${writtenFiles.join(", ")}`)

  // Fail loud if too few files were actually written. A partial sync where
  // 2/13 files got through (real result on v2026.4.29 with MAX_ITER_WRITER=4)
  // is functionally a broken release — we'd bump the version, declare done,
  // and the next 11 missed updates would never run. Threshold: ≥ 60% must
  // be written for the run to count as successful. Anything less means we
  // refuse the version bump and let the next run retry with no false success.
  const successRatio = writtenFiles.length / plannedItems.length
  const MIN_SUCCESS_RATIO = 0.6
  if (successRatio < MIN_SUCCESS_RATIO) {
    throw new Error(
      `Only ${writtenFiles.length}/${plannedItems.length} files written ` +
        `(${(successRatio * 100).toFixed(0)}% < ${MIN_SUCCESS_RATIO * 100}% threshold). ` +
        `Refusing to bump version. Per-file stop reason: ${writerStopped}. ` +
        `Inspect logs for which files hit max_iter or budget.`,
    )
  }
  if (writerStopped !== "clean" || writtenFiles.length < plannedItems.length) {
    console.warn(
      `⚠️  Partial sync: ${writtenFiles.length}/${plannedItems.length} file(s) written ` +
        `(stop reason: ${writerStopped}). Above threshold — committing what we have.`,
    )
  }

  // Save version + set outputs
  saveVersion(release.tag)
  setOutput("updated", "true")
  setOutput("version", release.tag)
  setOutput("release_notes", release.notes.slice(0, 800))

  console.log(
    `\n✅ Docs synced to OpenClaw ${release.tag}` +
      ` — tokens: ${totalInputTokens.toLocaleString()} in / ${totalOutputTokens.toLocaleString()} out`,
  )
}

main().catch((err) => {
  if (isCreditBalanceError(err)) {
    console.error(
      "\n💳 Anthropic API credit balance is too low. Top up at " +
        "https://console.anthropic.com/settings/billing — this is not a code bug.",
    )
    process.exit(2)
  }
  console.error(err)
  process.exit(1)
})
