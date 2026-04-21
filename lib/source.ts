import { docs } from "@/.source/server"
import { loader } from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons"
import { i18n } from "@/lib/i18n"

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n,
})
