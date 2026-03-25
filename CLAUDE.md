# Open Claw Learn

## Project Overview

Open Claw Learn is an educational learning platform built with Next.js. The site delivers interactive learning content with a focus on performance, accessibility, and SEO.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Fumadocs UI + shadcn-style primitives
- **Content**: Fumadocs (MDX-powered docs/learn UI)
- **Font**: Geist (Vercel)
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library

## Project Structure

```
/
├── app/                    # Next.js App Router pages and layouts
│   ├── (marketing)/        # Public-facing marketing pages
│   ├── (learn)/            # Learning content routes
│   ├── (auth)/             # Authentication routes
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Header, Footer, Sidebar, Navigation
│   ├── learn/              # Learning-specific components
│   └── marketing/          # Landing page sections
├── lib/                    # Shared utilities, helpers, constants
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles and Tailwind config
├── public/                 # Static assets (images, fonts, icons)
├── content/                # MDX/content files for lessons
└── .claude/                # Claude Code agents, skills, hooks
```

## Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm format       # Run Prettier
```

## Code Conventions

### TypeScript
- Strict mode enabled, no `any` types
- Use interfaces for object shapes, types for unions/intersections
- Export types from `types/` directory for shared types
- Use `satisfies` operator for type-safe object literals

### Components
- All components are `.tsx` files
- Use Server Components by default; only add `"use client"` when interactivity is required
- Props interfaces named `ComponentNameProps`
- One component per file, named exports preferred
- Colocate component-specific types, utils, and tests

### Styling
- Tailwind utility classes for all styling
- Use `cn()` utility (from `lib/utils.ts`) for conditional classes
- CSS variables for design tokens (colors, spacing, typography)
- Mobile-first responsive design
- Respect `prefers-reduced-motion` for all animations

### Imports
- Use path aliases: `@/components`, `@/lib`, `@/hooks`, `@/types`
- Import directly from source files, never from barrel/index files
- Dynamic imports for heavy components (`next/dynamic`)

### Naming
- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS variables: `--color-primary`, `--font-heading`

### SEO & AEO
- Every page route exports `metadata` or `generateMetadata`
- Use `next/image` for all images (never raw `<img>`)
- Use `next/link` for internal navigation (never raw `<a>`)
- Implement JSON-LD structured data for learning content
- Semantic HTML with proper heading hierarchy (single `<h1>` per page)

**AEO implementation — suggest updates proactively when content changes:**
- All docs pages auto-emit: `TechArticle` + `BreadcrumbList` JSON-LD (via `app/(docs)/[...slug]/page.tsx`)
- Pages with Q&A content → add `faqs:` frontmatter to emit `FAQPage` schema
- Pages with step-by-step instructions → add `howToSteps:` frontmatter to emit `HowTo` schema
- When new pages are added or existing content changes significantly, suggest which pages need `faqs:` or `howToSteps:` frontmatter added
- Key pages already annotated: `foundation/what-is-openclaw.mdx` (FAQPage), `reference/concepts.mdx` (FAQPage), `foundation/install.mdx` (HowTo), `level-up/deployment.mdx` (HowTo)
- Frontmatter format reference:
  ```yaml
  faqs:
    - q: "Question text"
      a: "Answer text"
  howToSteps:
    - "Step 1 description"
    - "Step 2 description"
  ```

### Performance
- Parallelize independent async operations with `Promise.all()`
- Use `React.cache()` for request deduplication
- Lazy-load below-fold content and heavy components
- Keep bundle size minimal — audit with bundle analyzer
- Target Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Accessibility (WCAG 2.2 AA)
- Keyboard navigation for all interactive elements
- Color contrast minimum 4.5:1 for text, 3:1 for UI
- Touch targets minimum 44x44px
- Visible focus indicators on all interactive elements
- Semantic HTML and ARIA labels where needed
- `alt` text on all meaningful images

## Available Claude Code Tooling

### Agents
Invoke via natural language or @-mention (e.g. `@"frontend-developer (agent)"`):
- **frontend-developer** — Full frontend app development (React, TypeScript, components, tests)
- **ui-ux-designer** — Research-backed design critique, accessibility audits, aesthetic guidance
- **documentation-expert** — Technical writing, README updates, API docs, user guides

### Skills (via slash commands)
- **/frontend-design** — Create distinctive, production-grade UI with bold aesthetic direction
- **/senior-frontend** — Component scaffolding, bundle analysis, Next.js optimization
- **/senior-backend** — API scaffolding, database migrations, load testing
- **/react-best-practices** — 40+ React/Next.js performance rules from Vercel Engineering
- **/ui-ux-pro-max** — Design system generation (50+ styles, 97 palettes, 57 font pairings)
- **/code-reviewer** — Automated code analysis, PR review, quality reports
- **/seo-optimizer** — Keyword strategy, meta tags, schema markup, Core Web Vitals
- **/file-organizer** — Directory cleanup, duplicate detection, project restructuring
- **/skill-creator** — Build and evaluate custom Claude Code skills

### Hooks
- **Next.js Code Quality Enforcer** — Automatically validates `.ts`/`.tsx` files on write/edit:
  - Checks Server vs Client Component correctness
  - Validates page/layout exports
  - Flags missing metadata, next/image, next/link usage
  - Warns on dynamic className without `cn()`/`clsx`

### Design System Generation
```bash
# Generate a complete design system for the project
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "education learning platform" --design-system -p "Open Claw Learn"

# Get stack-specific implementation guidelines
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "layout responsive" --stack nextjs
```

## Git Workflow

- Branch from `main` for all work
- Branch naming: `feat/`, `fix/`, `docs/`, `refactor/`
- Commit messages: concise, imperative mood ("Add lesson navigation", not "Added lesson navigation")
- Keep commits atomic — one logical change per commit

## Environment Variables

Store in `.env.local` (never commit):
```
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
```

## Key Decisions

- **App Router only** — No Pages Router patterns (`getServerSideProps`, `getStaticProps`)
- **Server Components first** — Client Components only when useState/useEffect/event handlers are needed
- **pnpm** — Consistent lockfile, faster installs
- **Tailwind v4** — Uses `@tailwindcss/postcss` plugin (via `postcss.config.mjs`)
- **Content in MDX** — Learning content managed as MDX files in `content/`
