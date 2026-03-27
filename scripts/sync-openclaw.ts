/**
 * sync-openclaw.ts
 *
 * Detects new OpenClaw releases and uses Claude to update affected docs.
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

// ─── GitHub helpers ──────────────────────────────────────────────────────────

async function getLatestRelease(): Promise<{ tag: string; notes: string } | null> {
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
    console.log(`GitHub API returned ${res.status} — no releases or rate limited`)
    return null
  }
  const data = await res.json() as { tag_name: string; body?: string }
  return { tag: data.tag_name, notes: data.body ?? "" }
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

// ─── Claude tools ─────────────────────────────────────────────────────────────

const tools: Anthropic.Tool[] = [
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
      return safeWrite(input.path, input.content)
    default:
      return `Unknown tool: ${name}`
  }
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

  // ── Agentic doc-update loop ──────────────────────────────────────────────

  const system = `You are a technical documentation maintainer for HowOpenClaw, a community docs site for OpenClaw (an open-source self-hosted AI assistant).

Your task: update the documentation to reflect changes introduced in a new OpenClaw release.

Rules:
- Only update files that are directly affected by the release notes
- Preserve all existing MDX structure, frontmatter (title, description, faqs, howToSteps), and component syntax (Callout, Steps, Step, Cards, Card, Tabs, Tab)
- Keep the same writing style and tone — factual, concise, actionable
- If a feature changed, update the relevant steps/descriptions
- If a feature is new, add it in the appropriate section
- If a feature was removed, note the removal with a Callout
- Focus on: content/channels/, content/reference/, content/goals/
- Skip content/foundation/ unless the release changes core concepts
- Do not update meta.json files`

  const userMessage = `OpenClaw released **${release.tag}**.

Release notes:
---
${release.notes || "(no release notes provided)"}
---

Previous version: ${lastVersion || "unknown"}

Steps:
1. list_docs to see what's available
2. Read the files most likely affected by these changes
3. write_file for any file that needs updating
4. Stop when done — only update what genuinely changed`

  let messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ]

  // Cap at 25 iterations to prevent runaway loops
  for (let i = 0; i < 25; i++) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      system,
      tools,
      messages,
    })

    messages.push({ role: "assistant", content: response.content })

    if (response.stop_reason === "end_turn") {
      console.log("\nClaude finished.")
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

  // ── Save version + set GH Actions outputs ───────────────────────────────
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
