# Codebase Memory

## Purpose

This is the durable technical snapshot after the 2026-10-30 editorial-platform and
Prisma migration implementation. The full compliance audit is in
`COMPLIANCE-AUDIT.md`; recurring production work is in `COMPLIANCE-OPERATIONS.md`;
the active release sequence is in `development-plan-06.md`.

## Repository Snapshot

Local machine files and generated output are consolidated under Git-ignored `.local/`: environment snapshots in `env/`, Next.js output in `next/`, TypeScript state in `cache/`, and Playwright/coverage artifacts in their named subdirectories. `node_modules`, `next-env.d.ts`, and the generated Prisma client retain conventional toolchain paths.

After relocation, both credential files retained their original SHA-256 hashes. Lint, strict types, 32 unit tests, production build, Markdown lint, and 12 cross-browser smoke checks passed; the three database-backed editorial browser checks were intentionally skipped during this filesystem-only verification.

- Project: recruiter-focused full-stack software-engineering portfolio.
- Branch: `pre-production`.
- Audit baseline commit: `2013a90981f4db2e07b29299313e02f060a71272`.
- Package manager/runtime: npm on Node.js 24 with a committed lockfile.
- Rendering model: Next.js App Router with server rendering by default and narrow
  client boundaries.
- Public origin: `https://faraz-hussain-portfolio.vercel.app` returns HTTP 200 without
  authentication. Standard Protection intentionally gates generated deployment and
  preview URLs. PR #11 deployed the Prisma-backed release at this origin and passed live verification.

## Technical Baseline

| Area              | Current implementation                                            |
| ----------------- | ----------------------------------------------------------------- |
| Framework         | Next.js 16.4.3 with App Router and Turbopack                      |
| UI runtime        | React and React DOM 19.3.1                                        |
| Language          | TypeScript 5.9 with `strict` and `noEmit`                         |
| Styling           | Tailwind CSS 4.3.3 with tested semantic tokens                    |
| Theme             | `next-themes` with system, light, and dark modes                  |
| Animation         | `motion` with reduced-motion-aware primitives                     |
| Fonts             | Self-hosted Geist Sans and Geist Mono                             |
| Icons             | Lucide interface icons and React Icons brand components           |
| Testing           | Vitest, Testing Library, axe-core, Playwright, and GitHub Actions |
| Compiler          | React Compiler enabled                                            |
| Persistence       | Prisma ORM 7.10.1 with PostgreSQL and committed migrations        |
| Editorial content | Zod-validated Markdown with per-post SEO controls                 |

## Application Architecture

1. `src/app/layout.tsx` owns fonts, metadata, viewport behavior, skip navigation,
   theme context, and privacy-aware analytics.
2. `src/app/page.tsx` composes Navbar, Hero, About, Skills, Projects, Experience,
   Contact, and Footer around `#main-content`.
3. `/privacy` publishes data practices and reversible analytics choices.
4. `/quality` publishes dated engineering evidence and explicit limitations.
5. `/blog`, `/blog/[slug]`, and `/rss.xml` publish database-backed editorial content.
6. `/studio` is a signed-session-protected authoring and on-page SEO workspace.
7. `/resume` embeds and downloads the approved same-origin resume PDF.
8. `src/data/siteConfig.ts` remains the typed source of truth for portfolio content.
9. `/api/contact` validates body type, size, and fields; handles a honeypot; enforces
   HMAC-pseudonymous Prisma-backed production throttling; escapes HTML; applies an
   outbound timeout; and delivers through Resend.
10. If delivery is unavailable, the client offers a blank email draft without placing
    submitted personal content in a URL.

## Privacy and Security Decisions

- Vercel Web Analytics defaults on for public pages, with a persistent opt-out and GPC/DNT handling. Historical opt-in statements are superseded by the October 30 policy.
- Withdrawal uses an event filter so an already-loaded script cannot send later events.
- Routine contact retention is capped at 12 months after the last substantive exchange,
  subject to narrow published exceptions and an operations runbook.
- Production contact delivery fails closed unless Resend, Prisma Postgres, and a
  unique HMAC salt are configured.
- Local rate-limit state is bounded and pruned; production counters expire after ten
  minutes.
- Contact responses are non-cacheable and provider calls have timeouts.
- CSP, HSTS, MIME, frame, referrer, permissions, and cross-origin headers are enforced;
  `X-Powered-By` is disabled.
- The CSP retains inline script/style allowances required by the current static
  Next.js/theme architecture and must be reassessed when that architecture changes.

## Accessibility Decisions

- Foreground text tokens meet at least 4.5:1 and default control boundaries meet at
  least 3:1 in both themes through automated tests.
- The layout supplies a focus-visible skip link and stable main target.
- Interactive targets, focus treatment, mobile-menu containment/restoration, labels,
  status semantics, and reduced motion are covered by regression tests.
- Forced-colors behavior is present and decorative icons use coherent hidden semantics.
- External-context links announce the new tab in their accessible name.
- Automated checks are evidence, not a claim of WCAG certification.

## Licensing and Evidence

- `LICENSE` records an all-rights-reserved policy for original source and signature art.
- `ASSET-PROVENANCE.md` records signature, preview, icon, and trademark provenance.
- `THIRD_PARTY_NOTICES.md` records direct runtime dependency licenses.
- `/quality` narrows public claims to retained evidence and publishes limitations.

## Search Discovery

- The production origin publishes canonical metadata and explicit `index, follow`
  directives with expanded Googlebot preview permissions.
- Root `robots.txt` allows public pages, blocks `/api/`, declares the canonical host,
  and references the absolute sitemap.
- Root `robots.txt` also blocks `/studio/`; studio pages independently emit `noindex`.
- The homepage publishes `ProfilePage`, `Person`, and `WebSite` JSON-LD generated from
  the same typed public configuration as the visible portfolio.
- Published articles emit canonical and social metadata plus safe `BlogPosting`
  JSON-LD. Indexable posts are added to the dynamic sitemap and RSS feed.
- Optional `GOOGLE_SITE_VERIFICATION` metadata supports Search Console URL-prefix
  verification without committing an account-specific token.
- Search Console verification, sitemap submission, and indexing requests remain
  production account operations rather than repository actions.

## CI Security Automation

- `.github/dependabot.yml` schedules weekly npm and GitHub Actions updates into `pre-production`; native security updates follow `main`. Coupled Prisma packages are grouped and unsupported compiler/linter/runtime-type major updates stay behind explicit review.
- Six workflows cover quality, redacted full-history/current-source Gitleaks scanning, npm audit/dependency review, CodeQL security analysis, Actionlint validation, and daily/post-Production public-domain verification.
- External Actions use verified commit SHAs. Gitleaks 8.30.1 and Actionlint 1.7.12 use checksum-pinned binaries extracted into private temporary directories under `.local/tools/`, with exit-time cleanup; redacted scanner reports stay in `.local/security/`.
- Native vulnerability alerts and automated security updates were enabled on October 30, 2026; native secret scanning and push protection were already enabled and were verified again.
- Local checks passed for workflow syntax, Dependabot's schema, full Git history/source scanning, dependency audit, and a synthetic token rejection/redaction test. Hosted quality, CodeQL, dependency review/audit, scanning, workflow lint and Production public verification now pass. Branch-rule requirements are configured separately.

## October 30 Acceptance Update

- The owner confirmed the resume and Search Console setup and authorized `pre-production` delivery, a PR, and merge to `main` after passing checks. A human assistive-technology listening session remains outstanding and is accepted as a release limitation.
- Studio review corrected error associations/focus, skip targets, named actions, keyboard-scrollable preview, saved feedback, and a reproduced WebKit hydration input-loss race.
- Current local results: 37 unit tests, 2 Preview PostgreSQL tests, and 19 browser checks pass; two duplicate keyboard-only configurations are skipped. Light/dark axe scans and screenshots were reviewed. No NVDA/VoiceOver listening test was performed.
- The researched first article is `shipping-less-javascript-nextjs-16-4`, inserted as `PUBLISHED` in Production on October 30 at 15:44 UTC. Versioned source cites official React/Next.js material and makes no unmeasured performance claims.
- Default-on analytics is requested and documented, with persistent opt-out, existing denials, GPC/DNT, fail-closed storage, private-path exclusion, and query/fragment redaction. Historical opt-in compliance ratings are not current legal approval of this model.
- Vercel's Git integration points to `asteroidcrib729/portfolio-next-web-app`, Production branch `main`; Web Analytics is already enabled. `NEXT_PUBLIC_SITE_URL` now covers Preview and Production with the sole canonical origin.
- See `RELEASE-06-VERIFICATION.md` for completed live release evidence and scoped Upstash retirement.

## Verification Results

| Check                                           | Result | Evidence                                                                       |
| ----------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| `npm run lint`                                  | Pass   | Zero ESLint errors or warnings                                                 |
| `npm run typecheck`                             | Pass   | Strict TypeScript succeeds                                                     |
| `npm run test`                                  | Pass   | 12 files and 37 tests                                                          |
| `npm run build`                                 | Pass   | 18 static and dynamic route entries compile/generate                           |
| Database integration                            | Pass   | Two tests against Preview validate concurrent quotas and expired windows       |
| `npm run test:e2e` with editorial configuration | Pass   | 19 local checks; 2 duplicate keyboard tests skipped; Linux CI includes Firefox |
| Runtime headers/routes                          | Pass   | Privacy/quality/home 200; security headers present; no `X-Powered-By`          |
| npm audit                                       | Pass   | Zero known vulnerabilities                                                     |
| Public production origin                        | Pass   | New release, article, RSS/sitemap, privacy, resume and studio checked live     |

## Operational Guidance

- Run `npm run check:full` before a release after installing Playwright browsers.
- Run `npm run verify:public -- https://faraz-hussain-portfolio.vercel.app` from a
  signed-out network context after every production release.
- Follow `COMPLIANCE-OPERATIONS.md` monthly and quarterly.
- Keep all Resend, Prisma, studio-authentication, and rate-limit values server-only.
- Keep Preview and Production Prisma connection strings isolated.
- Production and Preview use separate ready Prisma Postgres database projects in Singapore; the initial migration is applied in both.
- Separate sensitive `DATABASE_URL`, `RATE_LIMIT_SALT`, `EDITORIAL_STUDIO_PASSWORD`, and `EDITORIAL_STUDIO_SESSION_SECRET` values are configured in Vercel.
- Private generated credentials are in Git-ignored `.local/env/.env.phase06.production.local` and `.local/env/.env.phase06.preview.local` files; transfer passwords to a password manager.
- Upstash retirement is complete: five live emails delivered, sixth request throttled; the exact obsolete store and unused integration were deleted and all eight old environment records removed.
- Production GitHub/Prisma project linking is active on `main`; the separate Preview project uses scoped Vercel credentials because Prisma allows only one project link per repository.
- Native Chromium PDF rendering and named download were verified. The lightweight headless shell has no PDF viewer; direct links and visible fallback text remain available.
- Release evidence, alert triage and accepted human screen-reader/legal-review limitations are in `RELEASE-06-VERIFICATION.md`.
- Never broaden privacy, accessibility, performance, or professional claims beyond
  retained evidence.
- Re-run contrast, axe, keyboard, mobile, and cross-browser checks after visual or
  interaction changes.

## Dependency Security Maintenance: November 3, 2026

- The uploaded audit run on `main` failed on GHSA-g3hv-75wg-m249: minimatch 3.1.5 and 10.2.6 produced 16 moderate dependency-chain findings. See ISS-013 and SOL-013.
- The local remediation retains the existing direct lint-toolchain versions and uses the private `tooling/minimatch-compat` workspace plus parent-scoped overrides. The official engine is pinned at 11.0.4 through `@portfolio/minimatch-engine`; its registry integrity remains in the lockfile. The facade version reflects the engine baseline and is not an unmodified upstream distribution.
- The adapter forwards callable, named and class contracts. Its legacy `makeRe` surface is a `.test()` predicate only, as documented; no old regex/matching implementation is copied. Remove this layer once all lint consumers support patched APIs natively.
- Initial relative-file overrides were rejected because their installed tree contained invalid links despite a clean audit. The final graph passes a fresh `npm ci`, `npm ls minimatch --all`, and `npm ls --depth=0` with no invalid matching dependencies. A regression assertion rejects the malformed parent-link layout.
- The exact failing CI command, `npm audit --package-lock-only --audit-level=moderate`, now reports zero vulnerabilities. CI workflows and their audit severity threshold are unchanged.
- Five new regression tests cover actual lint-consumer resolution, official-engine version and lockfile integrity, legacy predicates/defaults, known preprocessing amplification bounded to 16 glob parts in a time/memory-limited child, and real import/React/accessibility rule canaries.
- `npm run check:full` passed formatting, lint, strict TypeScript, 46 unit tests and production build. Default local Chromium/WebKit/mobile coverage passed 12 browser checks; nine database/studio-gated checks were skipped without service credentials. Two database integration tests were also skipped in the default unit run. No live contact email or Production database test was performed for this tooling-only change.
- The initial migration checksum remains `4bff4947f76eb3b5e4ef55d519cac007f8aa579d60cf60e8b8e0997304f7516b`. No secrets, database schemas, privacy controls, or application-runtime imports changed.
- ESLint 9.39.5 remains npm-deprecated. A coordinated ESLint 10/plugin migration is separate follow-up work, not bypassed with forced peer dependencies. The current security advisory is resolved without claiming renewed upstream support for ESLint 9.
- This is local implementation evidence, not a claim of hosted CI success or deployment. Commit, push and release require separate owner authorization.
