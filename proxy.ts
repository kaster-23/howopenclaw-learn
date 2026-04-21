import { NextRequest, NextResponse } from "next/server"

const LANGUAGES = ["en", "es", "pt", "ja"]
const DEFAULT_LANG = "en"

const RATE_LIMIT = 30 // requests per window per IP
const WINDOW_MS = 60_000 // 1 minute

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function proxy(request: NextRequest) {
  // Enforce www canonical — redirect bare domain to www (301).
  const host = request.headers.get("host") ?? ""
  if (host === "howopenclaw.com") {
    const wwwUrl = new URL(request.url)
    wwwUrl.host = "www.howopenclaw.com"
    return NextResponse.redirect(wwwUrl.toString(), { status: 301 })
  }

  // Rate-limit the search API
  if (request.nextUrl.pathname === "/api/search") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
    const now = Date.now()
    const entry = requestCounts.get(ip)

    if (!entry || now > entry.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
      return NextResponse.next()
    }

    if (entry.count >= RATE_LIMIT) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      })
    }

    entry.count++
  }

  // --- i18n locale routing ---
  const { pathname } = request.nextUrl

  // Skip locale routing for API, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split("/").filter(Boolean)
  const firstSeg = segments[0] ?? ""
  const hasLocalePrefix = LANGUAGES.includes(firstSeg)
  const requestHeaders = new Headers(request.headers)

  if (hasLocalePrefix) {
    // Redirect /en/... → /... (default locale should not appear in URL)
    if (firstSeg === DEFAULT_LANG) {
      const url = request.nextUrl.clone()
      url.pathname = "/" + segments.slice(1).join("/") || "/"
      return NextResponse.redirect(url, 308)
    }

    // Non-default locale: pass through with locale header
    requestHeaders.set("x-locale", firstSeg)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // No locale prefix: rewrite internally to /en/... for the [lang] route segment
  requestHeaders.set("x-locale", DEFAULT_LANG)
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LANG}${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon\\.ico).*)",
}
