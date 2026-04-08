import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config"
import { rehypeCode } from "fumadocs-core/mdx-plugins"
import { z } from "zod"
import { readFileSync } from "fs"
import { resolve } from "path"

// Read version at config evaluation time — same source as lib/openclaw-version.ts
const OPENCLAW_VERSION = (() => {
  try {
    return readFileSync(resolve(process.cwd(), ".openclaw-last-version"), "utf8").trim()
  } catch {
    return "v2026.4.7"
  }
})()

type MdastNode = {
  type: string
  name?: string
  children?: MdastNode[]
}

// Replace <OpenClawVersion /> JSX nodes with the literal version string at compile time.
// Avoids any runtime component dependency in MDX files.
function walkAndReplace(node: MdastNode): void {
  if (!node.children) return
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    if (
      (child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") &&
      child.name === "OpenClawVersion"
    ) {
      node.children.splice(i, 1, { type: "text", value: OPENCLAW_VERSION } as MdastNode)
    } else {
      walkAndReplace(child)
    }
  }
}

function remarkOpenClawVersion() {
  return (tree: MdastNode) => walkAndReplace(tree)
}

export const docs = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema.extend({
      faqs: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .optional(),
      howToSteps: z
        .array(z.string())
        .optional(),
      readTime: z.number().optional(),
      moduleNumber: z.number().optional(),
      videoUrl: z.string().optional(),
      learningObjectives: z.array(z.string()).optional(),
      prerequisites: z.array(z.string()).optional(),
      nextModule: z.string().optional(),
      prevModule: z.string().optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkOpenClawVersion],
    rehypePlugins: [
      [rehypeCode, { themes: { light: "github-light", dark: "github-dark" } }],
    ],
  },
})
