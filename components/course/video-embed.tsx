"use client"

import { useEffect, useRef, useState } from "react"
import { Play } from "lucide-react"

interface VideoEmbedProps {
  url: string
  title: string
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="not-prose my-8">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-fd-border bg-fd-muted">
        {visible ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-fd-primary/90 text-white">
                  <Play className="ml-0.5 size-6" />
                </div>
              </div>
            )}
            <iframe
              src={url}
              title={title}
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-fd-primary/90 text-white">
              <Play className="ml-0.5 size-6" />
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-fd-muted-foreground">
        {title}
      </p>
    </div>
  )
}
