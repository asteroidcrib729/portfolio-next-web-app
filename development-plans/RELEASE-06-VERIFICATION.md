# Phase 06 Release Verification

## Scope and authorization

On October 30, 2026 the owner confirmed the resume, confirmed existing Search Console setup, requested a researched first article, approved default-on analytics with opt-out, and authorized committing to `pre-production`, opening a pull request, and merging into `main` after checks pass. The owner accepted a documented human screen-reader testing limitation. Production checks precede retirement of the portfolio's Upstash resource.

## Accessibility review

This review uses agent-operated Playwright keyboard traversal, browser accessibility-tree inspection, screenshots, and axe-core. It is not a human listening test with NVDA, Narrator, JAWS, or VoiceOver and does not certify WCAG conformance. A human assistive-technology session remains an acceptance task, not a completed claim.

The review covers login, invalid credentials, the dashboard, new/edit forms, invalid server-side fields, private preview, deletion confirmation, and sign-out. It checks Tab/Shift+Tab, Enter, Space, native select arrows, the skip link, focus visibility and movement, labels, error descriptions, saved status, preview scrolling, light/dark contrast, and small-screen overflow.

Corrections made during review:

- Make all studio main landmarks focusable by the skip link.
- Associate server field errors and character/word hints with controls; mark invalid fields and move focus to the first invalid control.
- Expose login errors and successful saves through accessible feedback.
- Give dashboard action links article-specific names and announce new-tab navigation.
- Make the scrollable Markdown preview keyboard-reachable.
- Disable editor controls until React hydration completes to prevent early input loss reproduced in WebKit.

Evidence files are retained locally under `.local/test-results/` and `.local/playwright-report/`. They are test evidence, not substitute screen-reader audio. Final results and deployment identifiers are recorded below as the gates complete.

## First article research

The selected topic is **Shipping Less JavaScript in Next.js 16.4: Start at the Client Boundary**, researched October 30. It combines the October 28 bundle-analysis tooling announcement with this repository's public-reader/private-editor separation. Considered alternatives were the October 16 Partial Prefetching case study and the October 27 notice of an upcoming November security release. The selected topic is immediately applicable to the implemented project without speculative vulnerability details or an unrelated caching migration.

Primary sources:

- [October 28 Next.js bundle tooling announcement](https://nextjs.org/blog/ship-less-javascript-with-ai).
- [React client-boundary reference](https://react.dev/reference/rsc/use-client).
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- [Next.js package-bundling guide](https://nextjs.org/docs/app/guides/package-bundling).
- [October 16 navigation case study](https://nextjs.org/blog/improving-navigation-experience-in-v0-with-nextjs-16-4).
- [October 27 security release notice](https://nextjs.org/blog/upcoming-nextjs-security-release-november-2026).

Versioned article source and metadata are in `content/articles/`. The published body omits the Markdown file's top-level title because the article route supplies its own H1. There are no invented benchmarks. The owner approved the Prisma publishing request, and the Production row was inserted on October 30 at 15:44 UTC with status `PUBLISHED`. Public readability still requires the new app deployment.

## Search appearance

The preferred site name is `Faraz Hussain`, with portfolio and hostname alternatives in the existing `WebSite` JSON-LD node. Open Graph, application metadata, and the manifest use a consistent name. The meta description introduces Faraz as a full-stack software engineer before describing the projects, articles, skills, and resume; visible about copy follows the same order.

Google selects site names and snippets automatically. These changes provide stronger signals but cannot force a particular result or immediate recrawl. See Google's [site-name guidance](https://developers.google.com/search/docs/appearance/site-names) and [snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

## Analytics policy

Vercel Web Analytics is already enabled at the project level. Public-page analytics now defaults on after hydration; stored opt-outs, GPC, DNT, private routes, and unavailable browser storage disable collection. The `/privacy` control persists changes and the send-time filter blocks future events immediately after opting out, even if a script remains loaded. Event URL query strings and fragments are stripped. Existing opt-outs are not reset.

The historical compliance audit's default-off findings are explicitly superseded, not silently recertified. Applicable consent/lawful-basis requirements remain a legal review item.

## Local gate results

### First hosted run corrections

The first hosted run stopped the release before merge. Vercel's Next.js adapter expected `.next` despite the relocated Next.js output, so `vercel.json` now explicitly sets `outputDirectory` to `.local/next`. The clean CI checkout also exposed a formatting difference in the tracked Markdownlint configuration that was locally deleted; its versioned copy is formatted while the owner's local deletion is preserved.

CodeQL identified a check-then-write archive race and file/network data flows in the security-tool downloader. The loader now uses literal allowlisted download URLs, verifies the pinned SHA-256 before persistence, exclusively creates the archive at a fixed name in a fresh private directory, extracts only the expected binary, and cleans that exact directory on exit. Windows ZIP extraction requires a seekable archive. Any remaining content-flow alert must be reviewed against these integrity controls, not hidden by excluding the script from analysis.

- Formatting, lint, strict TypeScript, production build, workflow lint, and redacted full-history/current-source secret scanning pass.
- 37 unit tests and 2 real Preview PostgreSQL integration tests pass.
- 19 Chromium/WebKit/mobile browser checks pass, with two intentionally skipped duplicate keyboard traversals. The dedicated desktop Chromium keyboard flow passes. Firefox is reserved for Linux CI.
- Axe finds no violations in selected WCAG 2 A/AA, 2.1 AA, and 2.2 AA rules for login, dashboard, and light/dark new-post forms across the three local configurations. This is bounded automated evidence, not exhaustive conformance testing.
- Desktop light-mode and mobile dark-mode screenshots were visually reviewed. Controls and previews remain within their layouts; keyboard validation, error focus, preview access, deletion confirmation, and sign-out pass.

## Deployment and retirement gates

- Vercel project: `prj_9I5TiHL2f2gN0b4RAgdxHpJqaDHd`.
- GitHub repository: `asteroidcrib729/portfolio-next-web-app`; Vercel Production branch verified as `main`.
- Prisma Production and Preview database projects are isolated; their schema and migration history were verified previously. Deployment runs `prisma migrate deploy` before the Next.js build.
- Canonical public origin: `https://faraz-hussain-portfolio.vercel.app`.
- Do not expose generated deployment/Preview URLs or disable Standard Protection.
- Do not retire Upstash until the new Production application, contact throttling/delivery, journal/article, RSS, sitemap, and resume pass live checks.
- Remove only the portfolio's exact Upstash resource and obsolete environment records; preserve unrelated team resources and the Prisma databases.
