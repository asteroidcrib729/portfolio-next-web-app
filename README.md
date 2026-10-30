# Faraz Hussain's Portfolio Site

I have built this full-stack engineering portfolio as a polished, accessible, privacy-aware case study in modern product development.

Designed for recruiters and engineering teams, my portfolio presents both my work and the way I have built it. Using server-first React architecture, typed content, considered motion, resilient contact delivery, secure defaults, structured search metadata, and automated quality gates, I treat the site itself as evidence of my frontend and full-stack engineering approach.

## Technology

To create and maintain the experience, I have used:

- Next.js 16 with the App Router and Turbopack
- React 19 with React Compiler enabled
- TypeScript in strict mode
- Tailwind CSS 4 with a token-driven light and dark theme
- Motion for reduced-motion-aware transitions
- `next-themes` for persistent theme preferences
- Self-hosted Geist Sans and Geist Mono fonts
- Resend for contact-form delivery
- Prisma ORM and Prisma Postgres for editorial content and persistent throttling
- Zod, React Markdown, and GitHub Flavored Markdown for structured authoring
- Vercel Analytics behind an explicit visitor preference
- Vitest, Testing Library, axe-core, and Playwright for regression coverage
- GitHub Actions for automated linting, type checking, testing, and builds

## Local Development

I develop and verify the project with:

- Node.js 24
- npm 11, or the compatible npm version bundled with Node.js 24

If you want to run my portfolio locally, install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Once the server is running, you can open `http://localhost:3000` in your browser.

The public portfolio still renders when optional service credentials are absent. In that state, the editorial studio and direct contact delivery remain unavailable and published posts resolve to an empty journal. Public-page analytics follows the browser preference and Vercel deployment configuration independently of database/email credentials.

My production build does not download Google Fonts. The versioned local assets supplied by the `geist` package keep clean builds deterministic in restricted-network environments.

### Local files and generated output

I keep machine-only files in the Git-ignored `.local/` directory:

- `.local/env/` holds the private Production and Preview environment snapshots.
- `.local/next/` holds Next.js build output and its development cache.
- `.local/cache/` holds TypeScript's incremental build information.
- `.local/test-results/`, `.local/playwright-report/`, and `.local/coverage/` hold test artifacts and reports.

I keep `node_modules`, `next-env.d.ts`, and the generated Prisma client in their conventional toolchain locations. Standard automatically loaded `.env.local` files still belong at the root when used; the named snapshots in `.local/env/` are loaded explicitly. For example, I run Preview database integration checks with:

```bash
node --env-file=.local/env/.env.phase06.preview.local node_modules/vitest/vitest.mjs run src/lib/rateLimit.integration.test.ts --config vitest.config.mts
```

That database test also requires `RUN_DATABASE_TESTS=1` in the invoking environment. I use only the Preview snapshot for these tests.

I open the local browser report with `npx playwright show-report .local/playwright-report`.

## Quality Control

I keep the main verification tasks available as individual scripts:

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

I format the whole project with `npm run format` and verify it without changing files with `npm run format:check`. These commands cover all Prettier-supported files, including source code, styles, configuration, workflows, and Markdown documentation. My ignore rules protect local credentials, generated output, dependencies, and applied database migrations. I retain Prisma schema and SQL migration formatting through their own tooling; Prettier core does not format those file types.

For the standard local quality gate, I run:

```bash
npm run check
```

To include the production build and every configured browser project, I run:

```bash
npx playwright install chromium firefox webkit
npm run check:full
```

The browser harness uses a temporary local HTTPS certificate to test Production `Secure` cookies consistently across browsers. It requires OpenSSL on `PATH`; on Windows, it also detects the copy bundled with Git for Windows.

After deployment, I verify the public host, redirects, crawler files, metadata, and security headers with:

```bash
npm run verify:public -- https://faraz-hussain-portfolio.vercel.app
```

## Continuous Integration and Security

I run six GitHub Actions workflows:

| Workflow                    | Purpose                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Quality Gate                | Formatting, lint, strict types, unit tests, production build, PostgreSQL migration/concurrency checks, and browser tests |
| Secret Scanning             | Gitleaks scans all fetched Git history and a snapshot of current non-ignored source, with findings redacted              |
| Dependency Security         | Fails CI on moderate-or-higher npm vulnerabilities and vulnerable dependency additions                                   |
| CodeQL                      | Extended JavaScript and TypeScript security analysis                                                                     |
| Workflow Validation         | Actionlint validates workflow syntax, expressions, and available shell checks                                            |
| Public Release Verification | Anonymous checks of the canonical production domain daily, manually, and after successful Production deployment events   |

I schedule routine npm and GitHub Actions updates through `.github/dependabot.yml`, targeting `pre-production` for review. Prisma packages move together, compatible Next.js/React updates are grouped, and unsupported TypeScript, ESLint, and Node type major upgrades stay behind an explicit compatibility review. GitHub's native security updates follow the default branch, `main`, independently of routine version-update schedules. I do not auto-merge updates.

I have enabled native Dependabot vulnerability alerts and security updates. Native secret scanning and push protection are also enabled. The workflow files and scheduled Dependabot configuration become active after they are committed and pushed; schedules and the Dependabot configuration must reach the default branch.

For local security validation, I run:

```bash
npm run lint:workflows
npm run security:secrets
npm audit --package-lock-only --audit-level=moderate
```

The first two commands download checksum-pinned Actionlint and Gitleaks binaries into private temporary directories under `.local/tools/` on 64-bit Windows or Linux. Download URLs are allowlisted, checksums are verified before exclusive archive creation, and temporary tools are cleaned up on process exit. Secret scanning requires a full Git clone and writes redacted reports to `.local/security/`. It needs no provider credentials, extra repository secret, or Gitleaks license. Committed secrets remain in scope even if their paths later become Git-ignored.

When a scan fails, CI retains only the two redacted finding reports for seven days so I can investigate the affected files and commits.

I pin external Actions to commit SHAs, keep workflow token permissions limited, and avoid credentialed pull-request-target execution. Only CodeQL receives security-event write access. Failed CI browser traces are retained for seven days and contain disposable test data. GitHub-hosted CodeQL and dependency-review results still require a pushed workflow run; local workflow validation alone does not establish their result.

After the first successful hosted runs, I configure the desired checks as required in the repository's branch rules to enforce them before merging.

## Content Configuration

I keep public portfolio content in `src/data/siteConfig.ts`, giving biography copy, skills, experience, projects, navigation, and social profiles a single typed source of truth.

For environment-specific public values, I use:

```env
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-handle
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-handle
NEXT_PUBLIC_X_URL=https://x.com/your-handle
NEXT_PUBLIC_REPOSITORY_URL=https://github.com/your-handle/portfolio
```

If I leave a social URL empty, the corresponding link is omitted from the rendered interface.

## Editorial Studio and Database

I use Prisma Postgres as the relational source for articles, on-page SEO fields, publishing state, and expiring abuse-prevention buckets. The private `/studio` workspace supports Markdown authoring, draft previews, search-result previews, canonical overrides, social metadata, indexing controls, tags, and publish/archive state.

```env
DATABASE_URL=postgresql://user:password@host:5432/portfolio?sslmode=require
RATE_LIMIT_SALT=replace-with-at-least-32-random-characters
EDITORIAL_STUDIO_PASSWORD=replace-with-a-long-unique-password
EDITORIAL_STUDIO_SESSION_SECRET=replace-with-at-least-32-random-characters
```

I keep independent Prisma Postgres database projects and `DATABASE_URL` secrets for Vercel Production and Preview. This prevents drafts, test posts, login attempts, and rate-limit counters created in previews from affecting the public production database.

After changing `prisma/schema.prisma`, I create and verify a development migration, then deploy committed migrations non-interactively:

```bash
npm run db:migrate -- --name describe_the_change
npm run db:deploy
```

The Vercel build uses `prisma migrate deploy` before compiling Next.js. I never use `prisma db push` against Production.

I validate concurrent rate limiting against PostgreSQL and exercise the complete draft, publish, SEO, archive, delete, and logout workflow in browser tests. CI uses a disposable PostgreSQL 17 service for these checks. To run them locally against an isolated database, I supply its credentials and set `RUN_DATABASE_TESTS=1` for the database tests and `RUN_EDITORIAL_E2E=1` for the browser suite.

## Contact Delivery

I validate contact submissions on the server before delivering them through Resend. The route applies field and body-size limits, a honeypot, non-cacheable responses, provider timeouts, and Prisma-backed rate limiting. Production throttling uses an HMAC-pseudonymous client identifier instead of storing a raw network address.

```env
RESEND_API_KEY=re_your_api_key
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Portfolio <portfolio@your-verified-domain.example>
DATABASE_URL=postgresql://user:password@host:5432/portfolio?sslmode=require
RATE_LIMIT_SALT=replace-with-at-least-32-random-characters
```

I require database-backed throttling in production and fail closed when it is unavailable. The limiter stores only an HMAC-pseudonymized request identifier, invalidates its counter after ten minutes, prunes expired rows, and uses a bounded in-memory fallback during local development and testing.

When delivery is unavailable, I offer an explicit blank email draft instead of exposing provider or configuration details. I never place the submitted name, address, subject, or message in a URL; the visitor decides what to copy.

I cap routine enquiry retention at 12 months after the last substantive exchange, subject to the narrow exceptions stated in the privacy notice. I use `development-plans/COMPLIANCE-OPERATIONS.md` to guide mailbox and provider deletion.

## Architecture

I have organized the project around route composition, reusable interface primitives, focused page sections, typed content, and isolated operational helpers:

```text
src/
|- app/
|   |- api/contact/route.ts
|   |- blog/
|   |- privacy/page.tsx
|   |- quality/page.tsx
|   |- resume/page.tsx
|   |- studio/
|   |- layout.tsx
|   |- page.tsx
|   |- robots.ts
|   `- sitemap.ts
|- components/
|   |- blog/
|   |- common/
|   |- layout/
|   |- providers/
|   |- sections/
|   `- studio/
|- data/siteConfig.ts
|- lib/
|   |- analyticsPreference.ts
|   |- contactRateLimit.ts
|   |- editorial.ts
|   |- posts.ts
|   |- prisma.ts
|   |- rateLimit.ts
|   |- seo.ts
|   |- studioAuth.ts
|   `- utils.ts
|- test/setup.ts
`- types/index.ts
```

Using server-rendered page composition keeps the main experience lightweight, while narrowly scoped client components handle theme state, mobile navigation, animation, filtering, analytics preferences, contact-form interaction, and editorial authoring. Public articles remain server-rendered and emit post-specific metadata and `BlogPosting` JSON-LD.

## Resume

I host the approved resume at `/resume/faraz-hussain-resume.pdf`. The `/resume` page provides an in-browser same-origin PDF viewer, a direct new-tab view, and a named PDF download while preserving the site-wide security policy.

## Accessibility

I have designed the interface to remain usable across keyboard, pointer, touch, screen-reader, reduced-motion, high-contrast, and forced-colors contexts. In particular: I have,

- Provided a skip link and semantic page landmarks.
- Kept keyboard focus visible and contained appropriately in the mobile dialog.
- Restored focus after closing transient navigation.
- Maintained visible focus states and 44-pixel minimum interactive targets.
- Respected `prefers-reduced-motion` in reveal and interaction effects.
- Announced links that open a new browsing context.
- Preserved accessible names and coherent SVG semantics for icons and brand marks.
- Exposed live regions for asynchronous form status.
- Tested representative pages, controls, and color-token contrast with axe-core, Vitest, and Playwright.

Automated checks reduce regressions, but I do not present them as a substitute for manual assistive-technology testing.

## Privacy and Security

I enable aggregate Vercel Web Analytics by default on public pages and provide a persistent, reversible opt-out on `/privacy`. I preserve existing opt-outs, honor Global Privacy Control and Do Not Track, exclude studio/API routes, and strip query strings and fragments from analytics event URLs. Storage failures keep analytics off. My event filter rechecks the preference before every event, including after the script has loaded. This opt-out policy is not a claim that visiting constitutes consent or that cookie-free analytics is exempt from every jurisdiction's requirements.

I have also applied an enforced Content Security Policy, modern browser security headers, same-origin contact validation, bounded request processing, production-safe error responses, and protected source maps. The repository includes licensing, asset provenance, third-party notices, a dated quality-evidence page, and an operational release runbook.

My current Content Security Policy permits the inline scripts and styles required by the static Next.js and theme implementation while restricting origins, objects, framing, form targets, media, and browser capabilities. I reassess that policy whenever I introduce a dependency or external service.

These controls strengthen the application, but they do not by themselves establish legal compliance for every operator, jurisdiction, deployment, or data-processing arrangement.

## Deployment

I have deployed the site with Node.js 24. Before releasing it, I configure environment-scoped secrets, apply the committed Prisma migration to Preview and then Production, run `npm run check:full`, and validate the public deployment with `npm run verify:public`. The generated metadata routes include the web manifest, Open Graph image, robots file, dynamic sitemap, and RSS feed.

My sole intended public production origin is:

```text
https://faraz-hussain-portfolio.vercel.app
```

I use Vercel Standard Protection to require authentication on generated preview and deployment URLs. Only the production domain above is intended for anonymous access.

My public verification script fails on Vercel authentication redirects, `noindex`, non-HTTPS URLs, HTTP errors, or content that does not identify this portfolio. The `Public Release Verification` GitHub Actions workflow provides the same check as a manual release gate.

## Google Search Indexing

I publish indexable production metadata, canonical URLs, `robots.txt`, an absolute database-aware sitemap, an RSS feed, social previews, and `ProfilePage`, `Person`, `WebSite`, and per-article `BlogPosting` structured data. Drafts and the private studio are excluded from crawling.

To connect the deployment to Google Search Console, I set the optional verification value before building:

```env
GOOGLE_SITE_VERIFICATION=google_html_tag_content_value
```

After deploying, I:

1. Added `https://faraz-hussain-portfolio.vercel.app/` as a Search Console URL-prefix property.
2. Selected the HTML-tag verification method and copied only the value of its `content` attribute.
3. Saved that value as `GOOGLE_SITE_VERIFICATION` for the Vercel Production environment and created a new production deployment.
4. Completed ownership verification in Search Console.
5. Submitted `/sitemap.xml` in the Sitemaps report.
6. Inspected the production home page and request indexing.

I kept the verification variable and generated meta tag in place because Search Console periodically rechecks ownership. I omitted the `google-site-verification` prefix and surrounding HTML from the environment value.

Search-readiness does not guarantee ranking or immediate inclusion because crawling and indexing remain search-engine decisions.

## Documentation and Usage

I maintain implementation plans, audit findings, remediation notes, and operational guidance in `development-plans/`. The repository and its original assets remain all rights reserved unless I explicitly state otherwise in the applicable license or attribution file.
