# Codebase Memory

## Purpose

This is the durable technical snapshot after the 2026-09-21 compliance audit and
remediation. The full audit is in `COMPLIANCE-AUDIT.md`; recurring production work is
in `COMPLIANCE-OPERATIONS.md`; future differentiation remains in
`development-plan-05.md`.

## Repository Snapshot

- Project: recruiter-focused full-stack software-engineering portfolio.
- Branch: `pre-production`.
- Audit baseline commit: `2013a90981f4db2e07b29299313e02f060a71272`.
- Package manager/runtime: npm on Node.js 24 with a committed lockfile.
- Rendering model: Next.js App Router with server rendering by default and narrow
  client boundaries.
- Public origin: `https://faraz-hussain-portfolio.vercel.app` returns HTTP 200 without
  authentication. Standard Protection intentionally gates generated deployment and
  preview URLs. The pending release must still be deployed and verified at this origin.

## Technical Baseline

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16.3.4 with App Router and Turbopack |
| UI runtime | React and React DOM 19.2.8 |
| Language | TypeScript 5 with `strict` and `noEmit` |
| Styling | Tailwind CSS 4 with tested semantic tokens |
| Theme | `next-themes` with system, light, and dark modes |
| Animation | `motion` with reduced-motion-aware primitives |
| Fonts | Self-hosted Geist Sans and Geist Mono |
| Icons | Lucide interface icons and React Icons brand components |
| Testing | Vitest, Testing Library, axe-core, Playwright, and GitHub Actions |
| Compiler | React Compiler enabled |

## Application Architecture

1. `src/app/layout.tsx` owns fonts, metadata, viewport behavior, skip navigation,
   theme context, and privacy-aware analytics.
2. `src/app/page.tsx` composes Navbar, Hero, About, Skills, Projects, Experience,
   Contact, and Footer around `#main-content`.
3. `/privacy` publishes data practices and reversible analytics choices.
4. `/quality` publishes dated engineering evidence and explicit limitations.
5. `src/data/siteConfig.ts` is the typed source of truth for portfolio content.
6. `/api/contact` validates body type, size, and fields; handles a honeypot; enforces
   HMAC-pseudonymous distributed production throttling; escapes HTML; applies an
   outbound timeout; and delivers through Resend.
7. If delivery is unavailable, the client offers a blank email draft without placing
   submitted personal content in a URL.

## Privacy and Security Decisions

- Vercel Web Analytics is disabled until an explicit browser-level opt-in.
- Withdrawal uses an event filter so an already-loaded script cannot send later events.
- Routine contact retention is capped at 12 months after the last substantive exchange,
  subject to narrow published exceptions and an operations runbook.
- Production contact delivery fails closed unless Resend, Upstash, and a unique HMAC
  salt are configured.
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
- The homepage publishes `ProfilePage`, `Person`, and `WebSite` JSON-LD generated from
  the same typed public configuration as the visible portfolio.
- Optional `GOOGLE_SITE_VERIFICATION` metadata supports Search Console URL-prefix
  verification without committing an account-specific token.
- Search Console verification, sitemap submission, and indexing requests remain
  production account operations rather than repository actions.

## Verification Results

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | Pass | Zero ESLint errors or warnings |
| `npm run typecheck` | Pass | Strict TypeScript succeeds |
| `npm run test` | Pass | 9 files and 21 tests |
| `npm run build` | Pass | 10 route entries compile/generate |
| `npm run test:e2e` | Pass locally | Chromium, WebKit, and mobile Chromium; Firefox remains in Linux CI |
| Runtime headers/routes | Pass | Privacy/quality/home 200; security headers present; no `X-Powered-By` |
| npm audit | Pass | Zero known vulnerabilities |
| Public production origin | Pass for access | HTTP 200 without authentication; new release markers await deployment |

## Operational Guidance

- Run `npm run check:full` before a release after installing Playwright browsers.
- Run `npm run verify:public -- https://faraz-hussain-portfolio.vercel.app` from a
  signed-out network context after every production release.
- Follow `COMPLIANCE-OPERATIONS.md` monthly and quarterly.
- Keep all Resend, Upstash, and salt values server-only.
- Never broaden privacy, accessibility, performance, or professional claims beyond
  retained evidence.
- Re-run contrast, axe, keyboard, mobile, and cross-browser checks after visual or
  interaction changes.
