import { source } from "@/lib/source"
import { createFromSource } from "fumadocs-core/search/server"

export const { GET } = createFromSource(source, {
  // Japanese is not supported by Orama — use English stemmer as fallback
  localeMap: {
    ja: "english",
  },
})
