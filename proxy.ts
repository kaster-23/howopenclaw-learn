import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT = 30 // requests per window per IP
const WINDOW_MS = 60_000 // 1 minute

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function proxy(request: NextRequest) {
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
  return NextResponse.next()
}

export const config = {
  matcher: "/api/search",
}
