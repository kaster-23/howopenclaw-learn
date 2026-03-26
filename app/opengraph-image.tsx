import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(ellipse 80% 45% at 50% -5%, rgba(255,77,77,0.2), transparent 70%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "rgba(255,77,77,0.15)",
              border: "1px solid rgba(255,77,77,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: "#ff4d4d",
                borderRadius: "50%",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#fafafa",
              letterSpacing: "-0.5px",
            }}
          >
            HowOpenClaw
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "960px",
            letterSpacing: "-2px",
          }}
        >
          Build your AI assistant
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "26px",
            color: "#a1a1aa",
            marginTop: "20px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Community documentation for OpenClaw — open-source, self-hosted.
        </div>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "48px",
            padding: "8px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(255,77,77,0.3)",
            backgroundColor: "rgba(255,77,77,0.08)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#ff4d4d",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            howopenclaw.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
