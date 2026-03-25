import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config"
import { rehypeCode } from "fumadocs-core/mdx-plugins"
import { z } from "zod"

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
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [
      [rehypeCode, { themes: { light: "github-light", dark: "github-dark" } }],
    ],
  },
})
