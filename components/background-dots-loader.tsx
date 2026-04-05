"use client"

import dynamic from "next/dynamic"

const BackgroundDots = dynamic(() => import("@/components/BackgroundDots"), { ssr: false })

export function BackgroundDotsLoader() {
  return <BackgroundDots />
}
