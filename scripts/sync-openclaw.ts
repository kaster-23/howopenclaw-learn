/**
 * sync-openclaw.ts
 *
 * Three-phase doc sync using two models:
 *   Phase 1 — Haiku:  triage release notes → identify affected files + what to change
 *   Phase 2 — Sonnet: execute the plan → read targeted files, write updates
 *   Phase 3 — Sonnet: audit all written files → verify correctness, fix anything off
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

const MODEL_TRIAGE = "claude-haiku-4-5-20251001"
const MODEL_WRITER = "claude-sonnet-4-6"

// ─── GitHub helpers ──────────────────────────────────────────────────────────

async function getLatestRelease(): Promise<{ tag: string; notes: string } | null> {
  // List releases (includes prereleases); skip drafts. The GitHub API returns
  // them ordered by created_at desc, so [0] is the most recent.
  const res = await fetch(
    `https://api.github.com/repos/${OPENCLAW_REPO}/releases?per_page=10`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
      },
    }
  )
  if (!res.ok) {
    console.log(`GitHub API returned ${res.status} — no releases or rate limited`)
    return null
  }
  const releases = await res.json() as Array<{ tag_name: string; body?: string; draft: boolean }>
  const latest = releases.find((r) => !r.draft)
  if (!latest) {
    console.log("No non-draft releases found")
    return null
  }
  return { tag: latest.tag_name, notes: latest.body ?? "" }
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

// ─── Agentic loop ─────────────────────────────────────────────────────────────

async function runAgentLoop(
  model: string,
  system: string,
  userMessage: string,
  tools: Anthropic.Tool[],
  maxIter: number,
  label: string,
): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ]

  let lastText = ""

  for (let i = 0; i < maxIter; i++) {
    const response = await client.messages.create({
      model,
      max_tokens: 8096,
      system,
      tools,
      messages,
    })

    messages.push({ role: "assistant", content: response.content })

    // Collect any text output
    for (const block of response.content) {
      if (block.type === "text") lastText = block.text
    }

    if (response.stop_reason === "end_turn") {
      console.log(`  [${label}] finished.`)
      break
    }

    const toolCalls = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    )
    if (toolCalls.length === 0) break

    const results: Anthropic.ToolResultBlockParam[] = toolCalls.map((tool) => ({
      type: "tool_result",
      tool_use_id: tool.id,
      content: executeTool(tool.name, tool.input as Record<string, string>),
    }))

    messages.push({ role: "user", content: results })
  }

  return lastText
}

// ─── Phase 1: Haiku triage ────────────────────────────────────────────────────

async function triageRelease(
  releaseTag: string,
  releaseNotes: string,
  lastVersion: string,
): Promise<string> {
  console.log(`\n[Phase 1 — Haiku] Triaging release ${releaseTag}...`)

  const system = `You are a triage assistant for HowOpenClaw, an educational site about OpenClaw.

The site has these doc files:
- content/course/       — 10-module course (0-setup through 9-next-steps)
- content/channels/     — per-channel setup guides (telegram, slack, discord, whatsapp, imessage, signal, teams, webchat)
- content/reference/    — CLI reference, concepts, troubleshooting, pricing, system-requirements

Your job: given a release's changelog, identify which doc files need updating and what specifically to change in each.

Be precise and conservative — only flag files where the release notes directly affect the content. Output a structured plan.`

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
    15,
    "triage",
  )
}

// ─── Phase 2: Sonnet writes ───────────────────────────────────────────────────

async function executeUpdates(
  releaseTag: string,
  releaseNotes: string,
  triagePlan: string,
): Promise<string[]> {
  console.log(`\n[Phase 2 — Sonnet] Executing updates...`)

  const writtenFiles: string[] = []

  const system = `You are a technical documentation maintainer for HowOpenClaw, a course-based educational site for OpenClaw (an open-source self-hosted AI assistant).

The site is structured as a 10-module course (content/course/) plus secondary reference sections (content/channels/, content/reference/).

Rules:
- Only update the files identified in the triage plan
- Preserve all existing MDX structure and frontmatter — including course-specific fields: title, description, readTime, moduleNumber, learningObjectives, prerequisites, nextModule, prevModule, faqs, howToSteps
- Preserve all component syntax — both Fumadocs components (Callout, Steps, Step, Cards, Card, Tabs, Tab) and course components (ReadTime, LearningObjectives, ModuleNav, MarkComplete, VideoEmbed) and Mermaid fenced code blocks
- Keep the same writing style and tone — calm, professional, beginner-friendly, step-by-step
- If a feature changed, update the relevant steps/descriptions
- If a feature is new, add it in the appropriate module section using version-tagged Callouts: <Callout type="info" title="New in ${releaseTag}">
- If a feature was removed, note the removal with a Callout
- Do not change moduleNumber, readTime, nextModule, prevModule, or moduleId values
- After writing all files, output a plain list of the file paths you updated, one per line`

  const userMessage = `OpenClaw released **${releaseTag}**.

Release notes:
---
${releaseNotes || "(no release notes provided)"}
---

Triage plan from Phase 1:
---
${triagePlan}
---

Execute the triage plan:
1. For each file marked for update: read it, apply the specified changes, write it back
2. Skip files marked as no changes needed
3. After all writes, list the updated file paths`

  const finalText = await runAgentLoop(
    MODEL_WRITER,
    system,
    userMessage,
    writeTools,
    30,
    "writer",
  )

  // Extract written file paths from the final output
  for (const line of finalText.split("\n")) {
    const trimmed = line.replace(/^[-*]\s*/, "").trim()
    if (trimmed.startsWith("content/") && trimmed.endsWith(".mdx")) {
      writtenFiles.push(trimmed)
    }
  }

  return writtenFiles
}

// ─── Phase 3: Sonnet audit ────────────────────────────────────────────────────

async function auditUpdates(
  releaseTag: string,
  releaseNotes: string,
  writtenFiles: string[],
): Promise<void> {
  if (writtenFiles.length === 0) {
    console.log(`\n[Phase 3 — Sonnet] No files to audit.`)
    return
  }

  console.log(`\n[Phase 3 — Sonnet] Auditing ${writtenFiles.length} updated file(s)...`)

  const system = `You are a senior documentation auditor for HowOpenClaw.

Your job: review recently updated documentation files and fix any issues you find.

Check for:
- Broken MDX syntax (unclosed tags, malformed components, missing frontmatter fields)
- Version numbers that still reference old versions instead of ${releaseTag}
- Incomplete sentences or truncated content
- Callout titles that don't include the version tag
- Any leftover placeholder text like <OpenClawVersion /> that should be a literal version string
- Content that contradicts the release notes
- Anything that looks wrong or out of place

If a file looks correct, do not rewrite it. Only write_file when you find a real issue.`

  const fileList = writtenFiles.join("\n")

  const userMessage = `Files updated during the ${releaseTag} sync:
${fileList}

Audit each file:
1. Read it
2. Check for issues listed above
3. If you find issues, fix them with write_file
4. If it looks correct, move on

After reviewing all files, summarize what you found and fixed (or confirmed as correct).`

  await runAgentLoop(
    MODEL_WRITER,
    system,
    userMessage,
    writeTools,
    20,
    "auditor",
  )
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
  const triagePlan = await triageRelease(release.tag, release.notes, lastVersion)
  console.log(`\nTriage plan:\n${triagePlan}\n`)

  // Check if anything actually needs updating
  if (!triagePlan.includes("## Files to update") || triagePlan.match(/## Files to update\s*\n\s*## /)) {
    console.log("Triage found no files to update — nothing to do.")
    saveVersion(release.tag)
    setOutput("updated", "false")
    return
  }

  // Phase 2 — Sonnet: execute the triage plan
  const writtenFiles = await executeUpdates(release.tag, release.notes, triagePlan)
  console.log(`\nUpdated ${writtenFiles.length} file(s): ${writtenFiles.join(", ")}`)

  // Phase 3 — Sonnet: audit all written files
  await auditUpdates(release.tag, release.notes, writtenFiles)

  // Save version + set outputs
  saveVersion(release.tag)
  setOutput("updated", "true")
  setOutput("version", release.tag)
  setOutput("release_notes", release.notes.slice(0, 800))

  console.log(`\n✅ Docs synced to OpenClaw ${release.tag}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
