# Codebase Memory

## Purpose

This document is the durable technical snapshot of the portfolio repository after the 2026-09-10 scan and remediation release. Original findings and their completed remedies remain traceable in `ISSUES.md` and `SOLUTIONS.md`; future differentiation work is defined in `development-plan-05.md`.

## Repository Snapshot

- Project: recruiter-focused portfolio and frontend engineering case study.
- Branch: `pre-production`.
- Remediation base commit: `dd6b761`.
- Package manager and runtime: npm on Node.js 24 with a committed lockfile.
- Rendering model: server-first Next.js App Router with narrow client boundaries.
- Current maturity: Phase 3 and the issue-remediation release are complete; signature case studies, real professional evidence, advanced interaction, and launch certification are planned in Phase 5.

## Technical Baseline

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16.3.4 with App Router and Turbopack |
| UI runtime | React and React DOM 19.2.8 |
| Language | TypeScript 5.9.3 with `strict` and `noEmit` enabled |
| Styling | Tailwind CSS 4.3.3 with semantic CSS custom properties |
| Theme | `next-themes` 0.4.6 with system, light, and dark modes |
| Animation | `motion` 13.2.0 with reduced-motion-aware primitives |
| Fonts | Self-hosted Geist Sans and Geist Mono through `geist` 1.7.2 |
| Icons | `lucide-react` plus local typed brand SVGs |
| Testing | Vitest 5, Testing Library, jsdom, and GitHub Actions |
| Compiler | React Compiler enabled in `next.config.ts` |

## Application Architecture

1. `src/app/layout.tsx` owns self-hosted font variables, metadata, viewport behavior, and theme context.
2. `src/app/page.tsx` is a thin composition layer for Navbar, Hero, About, Skills, Projects, Experience, Contact, and Footer.
3. Server components render the document and content-heavy sections by default.
4. Client components are limited to theme state, the focus-managed mobile menu, viewport reveals, skill filtering, and contact interaction.
5. `src/data/siteConfig.ts` is the typed source of truth for identity, navigation, optional social profiles, skills, cases, statistics, and engineering approach.
6. `src/app/api/contact/route.ts` validates input, handles a honeypot and basic rate limit, and delivers through Resend when configured.
7. The contact client opens a prefilled mail message when server delivery is unavailable.

## User-Facing Sections

- Hero: positioning, primary actions, configured social channels, and a visual quality-system artifact.
- About: three-part engineering philosophy and verifiable stack/quality signals.
- Expertise: accessible client-side filtering across four capability groups.
- Work: three transparent case studies about the implemented portfolio system.
- Approach: a three-stage product, architecture, and verification method.
- Contact: direct email, copy action, social links, validated form, delivery status, and fallback.

The current cases intentionally avoid fictional employers, clients, and outcome metrics. Real employment history, external projects, profile URLs, resume, and verified measurements require owner-supplied source material before launch.

## Accessibility and Interaction Decisions

- Light accent `#0369a1` and dark accent `#38bdf8` replace the failed light cyan pairing.
- All primary interactive targets are at least 44 pixels high or wide.
- The mobile overlay publishes expanded state, contains keyboard focus, handles Escape, restores focus, and restores the exact previous body overflow value.
- Global CSS and Motion components honor `prefers-reduced-motion`.
- Social links distinguish HTTP destinations from `mailto:` and expose a single accessible name.
- Contact feedback uses status or alert semantics.
- Sections have sticky-header-safe scroll offsets and stable IDs.

## Metadata and Deployment Surface

- Owner-specific title, description, authorship, keywords, canonical, Open Graph, and X/Twitter metadata.
- Generated `/opengraph-image` route.
- Generated `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` routes.
- Dynamic `/api/contact` route.
- `.env.example` defines the canonical URL, optional profile links, and server-only Resend settings.
- Optional social profiles are omitted when their environment variables are unset.

## Verification Results

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | Pass | Zero ESLint errors or warnings |
| `npm run typecheck` | Pass | Strict TypeScript compilation succeeds |
| `npm run test` | Pass | Four files and eight tests pass |
| `npm run build` | Pass | Home, metadata routes, and contact route compile successfully |
| Restricted-network build | Pass | Fonts are served from the versioned local package |
| npm audit | Pass | Zero known vulnerabilities after dependency changes |

The local `node_modules` tree may label optional WASM packages used by the toolchain as extraneous even after `npm prune`. Clean CI uses `npm ci` and is the authoritative dependency-state check.

## Test and CI Coverage

- Content tests reject the previous fictional identity and generic destination patterns.
- Content tests verify unique record IDs, stable anchor syntax, and the direct email channel.
- Mobile navigation tests cover expanded state, scroll locking, Escape, and focus restoration.
- Social-link tests cover mail behavior and protected external contexts.
- Contact-route tests cover invalid payloads and the unconfigured-delivery fallback contract.
- GitHub Actions runs clean install, lint, typecheck, tests, and production build on pull requests and primary branches.

End-to-end browser, automated axe, visual-regression, and performance-budget coverage are deliberately scheduled in `development-plan-05.md`.

## Documentation and Governance

- `development-plans/` is versioned; it must not be re-added to `.gitignore`.
- `development-plan-01.md` is the master roadmap.
- `development-plan-04.md` records the completed section architecture.
- `development-plan-05.md` is the active feature, differentiation, and launch plan.
- `README.md` is the contributor and deployment entry point.
- `AGENTS.md` is the chronological implementation log and current file map.
- `ISSUES.md` preserves original scan findings and remediation dispositions.
- `SOLUTIONS.md` preserves solution rationale and acceptance criteria.

All planning Markdown must maintain blank lines around headings and lists and must not contain consecutive blank lines.

## Operational Guidance

- Use `C:\Program Files\nodejs\npm.cmd` where PowerShell policy blocks `npm.ps1`.
- Run `npm run check` before release-oriented changes are handed off.
- Keep server-renderable sections free of unnecessary client directives.
- Add public profile links and the canonical domain through environment configuration.
- Keep sensitive contact values server-only; only variables prefixed with `NEXT_PUBLIC_` may enter client output.
- Replace repository-derived portfolio copy only with owner-approved and verifiable professional facts.
- Preserve reduced-motion, keyboard, focus, contrast, and mail-fallback behavior as new visual features are added.
