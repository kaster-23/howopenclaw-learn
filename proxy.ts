import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT = 30 // requests per window per IP
const WINDOW_MS = 60_000 // 1 minute

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function proxy(request: NextRequest) {
  // Enforce www canonical — redirect bare domain to www (301).
  // Prevents "Alternate page with proper canonical tag" in GSC caused by
  // all <link rel="canonical"> pointing to www while non-www is also served.
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

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon\\.ico).*)",
}
