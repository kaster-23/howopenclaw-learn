import { LandingHeader } from "@/components/landing-header"
import { Footer } from "@/components/footer"
import { SectionLayout } from "@/components/section-sidebar"
import type { ReactNode } from "react"

export default function CleanDocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingHeader />
      <main id="main-content">
        <SectionLayout>{children}</SectionLayout>
      </main>
      <Footer />
    </>
  )
}
