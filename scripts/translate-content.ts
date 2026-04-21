/**
 * Auto-translate English MDX content to es/pt/ja using Claude Haiku.
 *
 * - Scans content/ for English source files (no locale dot segment)
 * - Checks if translated variants (.es.mdx, .pt.mdx, .ja.mdx) are missing or stale
 * - Translates via Claude, preserving MDX components, code blocks, frontmatter structure
 * - Also generates meta.{locale}.json files
 *
 * Usage:  pnpm tsx scripts/translate-content.ts [--force]
 *   --force: retranslate all files regardless of staleness
 */

import Anthropic from "@anthropic-ai/sdk"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const LOCALES = ["es", "pt", "ja"] as const
type Locale = (typeof LOCALES)[number]

const LOCALE_NAMES: Record<Locale, string> = {
  es: "Spanish",
  pt: "Brazilian Portuguese",
  ja: "Japanese",
}

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const MODEL = "claude-haiku-4-5-20251001"
const MAX_CONCURRENT = 5

const forceAll = process.argv.includes("--force")

const client = new Anthropic()

// ── Helpers ──────────────────────────────────────────────────────────

function getGitModTime(filePath: string): number {
  try {
    const iso = execSync(`git log -1 --format="%aI" -- "${filePath}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim()
    if (iso) return new Date(iso).getTime()
  } catch { /* fall through */ }
  return 0
}

function findMdxFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(full))
    } else if (entry.name.endsWith(".mdx") && !isLocaleFile(entry.name)) {
      results.push(full)
    }
  }
  return results
}

function findMetaFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMetaFiles(full))
    } else if (entry.name === "meta.json") {
      results.push(full)
    }
  }
  return results
}

/** Returns true for files like `page.es.mdx` or `meta.pt.json` */
function isLocaleFile(name: string): boolean {
  for (const locale of LOCALES) {
    if (name.includes(`.${locale}.`)) return true
  }
  return false
}

function translatedPath(sourcePath: string, locale: Locale): string {
  // content/course/0-setup.mdx → content/course/0-setup.es.mdx
  const ext = path.extname(sourcePath) // .mdx or .json
  const base = sourcePath.slice(0, -ext.length)
  return `${base}.${locale}${ext}`
}

function isStale(sourcePath: string, translatedPath: string): boolean {
  if (!fs.existsSync(translatedPath)) return true
  if (forceAll) return true
  const srcTime = getGitModTime(sourcePath) || fs.statSync(sourcePath).mtimeMs
  const tgtTime = getGitModTime(translatedPath) || fs.statSync(translatedPath).mtimeMs
  return srcTime > tgtTime
}

// ── Translation prompts ─────────────────────────────────────────────

function mdxTranslationPrompt(locale: Locale): string {
  return `You are translating MDX documentation for OpenClaw, an open-source self-hosted AI assistant.
Translate to ${LOCALE_NAMES[locale]}.

RULES — follow these exactly:
1. Translate all prose text, headings, and paragraphs.
2. Translate frontmatter fields: title, description.
3. Translate FAQ questions and answers (the q: and a: values).
4. Translate howToSteps and learningObjectives arrays.
5. DO NOT translate: code blocks, terminal commands, inline code (\`...\`), component names, prop names, URLs, file paths, variable names.
6. DO NOT translate the word "OpenClaw" — it is a proper noun.
7. Preserve ALL MDX component syntax exactly as-is: <Callout>, <Steps>, <Step>, <Card>, <Cards>, <Tab>, <Tabs>, <ReadTime>, <LearningObjectives>, <ModuleNav>, <CourseProgress>, <MarkComplete>, <VideoEmbed>, <Mermaid>, <OpenClawVersion>, etc.
8. Preserve all import statements unchanged.
9. Keep the exact same frontmatter YAML structure. Do not change field names.
10. Keep markdown formatting (##, **, -, >, etc.) intact.
11. Keep the same line breaks and paragraph structure.
12. For technical terms that have no standard translation, keep the English term.

Return ONLY the translated file content, no explanation or code fences.`
}

function metaTranslationPrompt(locale: Locale): string {
  return `Translate this JSON sidebar configuration file to ${LOCALE_NAMES[locale]}.

RULES:
1. Only translate human-readable strings: the "title" field and section separator strings like "---Foundation---".
2. Do NOT translate: array keys, page file references (like "0-setup", "1-architecture"), icon names, or the word "OpenClaw".
3. Keep the exact same JSON structure.
4. Return ONLY the translated JSON, no explanation or code fences.`
}

// ── Core translation ────────────────────────────────────────────────

async function translateFile(
  sourcePath: string,
  locale: Locale,
  type: "mdx" | "meta"
): Promise<void> {
  const content = fs.readFileSync(sourcePath, "utf8")
  const outPath = translatedPath(sourcePath, locale)
  const relSource = path.relative(process.cwd(), sourcePath)
  const relOut = path.relative(process.cwd(), outPath)

  console.log(`  ${relSource} → ${relOut}`)

  const systemPrompt = type === "mdx" ? mdxTranslationPrompt(locale) : metaTranslationPrompt(locale)

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content }],
  })

  const translated = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim()

  if (!translated) {
    console.error(`    ⚠ Empty translation for ${relSource} [${locale}] — skipping`)
    return
  }

  fs.writeFileSync(outPath, translated + "\n", "utf8")
}

// ── Batched execution ───────────────────────────────────────────────

interface TranslationJob {
  sourcePath: string
  locale: Locale
  type: "mdx" | "meta"
}

async function runBatch(jobs: TranslationJob[]): Promise<{ ok: number; fail: number }> {
  let ok = 0
  let fail = 0

  // Process in chunks to respect rate limits
  for (let i = 0; i < jobs.length; i += MAX_CONCURRENT) {
    const chunk = jobs.slice(i, i + MAX_CONCURRENT)
    const results = await Promise.allSettled(
      chunk.map((job) => translateFile(job.sourcePath, job.locale, job.type))
    )
    for (const r of results) {
      if (r.status === "fulfilled") ok++
      else {
        fail++
        console.error(`    ✗ ${r.reason}`)
      }
    }
  }

  return { ok, fail }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌐 Translate content → ${LOCALES.join(", ")}${forceAll ? " (force)" : ""}\n`)

  // Collect MDX translation jobs
  const mdxFiles = findMdxFiles(CONTENT_DIR)
  const mdxJobs: TranslationJob[] = []

  for (const src of mdxFiles) {
    for (const locale of LOCALES) {
      const tgt = translatedPath(src, locale)
      if (isStale(src, tgt)) {
        mdxJobs.push({ sourcePath: src, locale, type: "mdx" })
      }
    }
  }

  // Collect meta.json translation jobs
  const metaFiles = findMetaFiles(CONTENT_DIR)
  const metaJobs: TranslationJob[] = []

  for (const src of metaFiles) {
    for (const locale of LOCALES) {
      const tgt = translatedPath(src, locale)
      if (isStale(src, tgt)) {
        metaJobs.push({ sourcePath: src, locale, type: "meta" })
      }
    }
  }

  const totalJobs = mdxJobs.length + metaJobs.length

  if (totalJobs === 0) {
    console.log("✅ All translations are up to date — nothing to do.\n")
    return
  }

  console.log(`📝 ${mdxJobs.length} MDX files + ${metaJobs.length} meta files to translate\n`)

  // Translate meta files first (smaller, faster)
  if (metaJobs.length > 0) {
    console.log("── Meta files ──")
    const metaResult = await runBatch(metaJobs)
    console.log(`   ✓ ${metaResult.ok} ok, ${metaResult.fail} failed\n`)
  }

  // Then MDX files
  if (mdxJobs.length > 0) {
    console.log("── MDX files ──")
    const mdxResult = await runBatch(mdxJobs)
    console.log(`   ✓ ${mdxResult.ok} ok, ${mdxResult.fail} failed\n`)
  }

  console.log("🏁 Translation complete.\n")
}

main().catch((err) => {
  console.error("Translation failed:", err)
  process.exit(1)
})
