import { defineI18n } from "fumadocs-core/i18n"
import { defineI18nUI } from "fumadocs-ui/i18n"

export const i18n = defineI18n({
  languages: ["en", "es", "pt", "ja"],
  defaultLanguage: "en",
  fallbackLanguage: "en",
  hideLocale: "default-locale",
  parser: "dot",
})

export const i18nUI = defineI18nUI(i18n, {
  en: { displayName: "English" },
  es: {
    displayName: "Español",
    search: "Buscar",
    searchNoResult: "Sin resultados",
    toc: "En esta página",
    tocNoHeadings: "Sin encabezados",
    lastUpdate: "Última actualización",
    chooseLanguage: "Elegir idioma",
    nextPage: "Siguiente",
    previousPage: "Anterior",
    chooseTheme: "Elegir tema",
    editOnGithub: "Editar en GitHub",
  },
  pt: {
    displayName: "Português",
    search: "Pesquisar",
    searchNoResult: "Sem resultados",
    toc: "Nesta página",
    tocNoHeadings: "Sem títulos",
    lastUpdate: "Última atualização",
    chooseLanguage: "Escolher idioma",
    nextPage: "Próximo",
    previousPage: "Anterior",
    chooseTheme: "Escolher tema",
    editOnGithub: "Editar no GitHub",
  },
  ja: {
    displayName: "日本語",
    search: "検索",
    searchNoResult: "結果なし",
    toc: "目次",
    tocNoHeadings: "見出しなし",
    lastUpdate: "最終更新",
    chooseLanguage: "言語を選択",
    nextPage: "次へ",
    previousPage: "前へ",
    chooseTheme: "テーマを選択",
    editOnGithub: "GitHubで編集",
  },
})

/** Map locale code to BCP-47 language tag for JSON-LD inLanguage */
export const LOCALE_TO_LANG: Record<string, string> = {
  en: "en-US",
  es: "es",
  pt: "pt-BR",
  ja: "ja",
}

/** Map locale code to OpenGraph locale */
export const LOCALE_TO_OG: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
  ja: "ja_JP",
}
