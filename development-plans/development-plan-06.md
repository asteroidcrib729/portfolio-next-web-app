# Development Plan 06: Editorial Platform, Prisma Migration, and Resume Experience

## Purpose

This phase turns the portfolio from a primarily static presentation into a maintainable publishing platform. The work upgrades the dependency baseline, replaces Upstash with Prisma Postgres, introduces a private editorial studio and public engineering journal, expands on-page SEO control, and publishes an approved resume experience.

Status on October 31, 2026: implementation is released and technical verification has passed. The owner deferred the remaining human screen-reader listening session to prioritize other work. It remains unverified, not completed, and is not an active work item until the owner resumes it.

## Outcomes

The phase is complete when:

- Supported dependencies are upgraded and the lockfile resolves without invalid packages.
- Prisma ORM owns all relational persistence through committed migrations.
- Production and Preview deployments use isolated Prisma Postgres databases and credentials.
- The contact form and studio login use expiring HMAC-pseudonymous database rate limits.
- The private studio can create, edit, preview, publish, archive, and delete posts.
- Every published article controls its canonical URL, indexing state, social image, tags, SEO title, and meta description.
- The journal publishes accessible articles, `BlogPosting` JSON-LD, RSS, and sitemap entries.
- The resume can be viewed in-browser, opened directly, and downloaded as a named PDF.
- Upstash variables, runtime calls, documentation, and the Vercel integration are removed after the Prisma cutover is verified.
- Linting, strict types, unit tests, browser tests, production build, migration deployment, and public verification pass.

## Technical Decisions

### Dependency policy

- Upgrade to the latest stable compatible release rather than accepting release candidates.
- Keep Prisma ORM and Prisma Client on the same stable version.
- Keep TypeScript on the newest version supported by `typescript-eslint`; TypeScript 7 is deferred until the lint toolchain supports its compiler API.
- Preserve Node.js 24 as the development and deployment runtime.
- Commit `package-lock.json` and use `npm ci` in automation.

### Database policy

- Use Prisma ORM 7 with the `prisma-client` generator and PostgreSQL driver adapter.
- Use Prisma Postgres in `ap-southeast-1`, the nearest available managed region to the portfolio owner.
- Use the `faraz-hussain-portfolio` database project for public articles and production rate limits.
- Use the separate `faraz-hussain-portfolio-preview` database project for draft validation, preview content, and preview rate limits.
- The connector can create a platform branch but cannot provision a database inside an existing branch. Separate projects provide database isolation without requiring a second CLI account connection.
- Use a separate local development connection when database-backed local testing is required.
- Run `prisma migrate deploy` in deployment automation; never use `prisma db push` against Production.
- Do not copy Upstash counters because they are ephemeral abuse-prevention state with a ten-minute window, not durable visitor records.

### Editorial security policy

- Keep `/studio` private, session-protected, and excluded from search indexing.
- Store the studio password and HMAC session secret as server-only Vercel Secrets.
- Use an HTTP-only, same-site, secure Production cookie with an eight-hour lifetime.
- Apply database-backed throttling to studio sign-in attempts.
- Validate all post fields with Zod on the server before persistence.
- Render Markdown without raw HTML execution.

## Data Model

### Post

The `Post` model contains:

- Stable ID and unique slug
- Title, excerpt, Markdown content, tags, and publishing state
- Focus keyword, SEO title, and meta description
- Canonical URL override
- Social image URL and alternative text
- Per-post `noIndex` control
- Published, created, and updated timestamps

### RateLimitBucket

The `RateLimitBucket` model contains:

- A scope-prefixed HMAC-pseudonymous key
- Request count
- Window start and expiry timestamps
- An expiry index for opportunistic pruning

A single parameterized PostgreSQL upsert uses the row lock to serialize competing requests. Its database-clock expiry and saturating count prevent concurrent first requests from bypassing the fixed-window limit.

## Route Map

| Route                              | Access        | Purpose                                      |
| ---------------------------------- | ------------- | -------------------------------------------- |
| `/blog`                            | Public        | Published article index                      |
| `/blog/[slug]`                     | Public        | Server-rendered article and article metadata |
| `/rss.xml`                         | Public        | RSS 2.0 discovery feed                       |
| `/resume`                          | Public        | Embedded resume viewer and PDF actions       |
| `/resume/faraz-hussain-resume.pdf` | Public        | Versioned same-origin resume document        |
| `/studio/login`                    | Private entry | Throttled editorial authentication           |
| `/studio`                          | Authenticated | Post inventory and publishing state          |
| `/studio/posts/new`                | Authenticated | New post editor                              |
| `/studio/posts/[id]`               | Authenticated | Existing post editor and SEO controls        |
| `/studio/preview/[id]`             | Authenticated | Private draft or archived-post preview       |

## Environment Matrix

| Variable                          | Development                | Preview                         | Production                  |
| --------------------------------- | -------------------------- | ------------------------------- | --------------------------- |
| `DATABASE_URL`                    | Local/development database | Preview database project        | Production database project |
| `RATE_LIMIT_SALT`                 | Local secret               | Preview-only secret             | Production-only secret      |
| `EDITORIAL_STUDIO_PASSWORD`       | Local author password      | Preview-only password           | Production-only password    |
| `EDITORIAL_STUDIO_SESSION_SECRET` | Local secret               | Preview-only secret             | Production-only secret      |
| `NEXT_PUBLIC_SITE_URL`            | Local URL                  | Canonical production URL        | Canonical production URL    |
| Resend variables                  | Optional fallback          | Preview test sender or disabled | Verified Production sender  |

Production and Preview values must be configured as separate Vercel Secrets. Preview must never receive the Production `DATABASE_URL`.

## Workstreams

### Workstream 1: Dependency modernization

- [x] Audit direct and development dependencies against the registry.
- [x] Upgrade Next.js, React, Tailwind CSS, Motion, Lucide, Playwright, Vitest, axe-core, jsdom, ESLint, type packages, and related tooling.
- [x] Add Prisma ORM, Prisma Client, PostgreSQL adapter, Zod, React Markdown, Remark GFM, dotenv, and Vite.
- [x] Pin TypeScript to the supported 5.9 line after confirming that the current lint stack rejects TypeScript 7.
- [x] Run the final dependency audit and review package install scripts.

### Workstream 2: Prisma migration

- [x] Add `prisma.config.ts` with environment-driven PostgreSQL configuration.
- [x] Add the Prisma schema and initial SQL migration.
- [x] Generate Prisma Client during installation.
- [x] Replace the Upstash REST limiter with an atomic Prisma SQL upsert and expiry pruning.
- [x] Add deployment and local migration scripts.
- [x] Obtain Prisma sponsor approval for the Production database.
- [x] Create separate Production and Preview database projects.
- [x] Apply the initial migration to Preview and validate it.
- [x] Apply the initial migration to Production and record its migration history.
- [x] Configure environment-scoped Vercel database, rate-limit, password, and session secrets.
- [x] Retire Upstash after live Production delivery and throttling pass; disconnect/delete the exact portfolio resource and uninstall its now-unused integration.

### Workstream 3: Editorial Studio

- [x] Add throttled password authentication and signed HTTP-only sessions.
- [x] Add post inventory, create, edit, preview, publish, archive, and delete workflows.
- [x] Add Markdown authoring and a live rendered preview.
- [x] Add title, excerpt, word-count, and metadata-length feedback.
- [x] Add SEO title, description, focus keyword, canonical, social image, alternative text, tags, and `noIndex` controls.
- [x] Exclude the studio from robots and page-level indexing.
- [ ] Deferred by the owner on October 31, 2026: complete a human NVDA/VoiceOver listening session. Agent-operated keyboard traversal, accessibility-tree inspection, and axe scans are recorded separately; the owner authorized release with this limitation documented.

### Workstream 4: Public journal and SEO

- [x] Add the public journal index and article routes.
- [x] Add article-specific canonical, robots, Open Graph, and Twitter metadata.
- [x] Add safe `BlogPosting` JSON-LD.
- [x] Add published, indexable posts to the sitemap.
- [x] Add an RSS 2.0 route.
- [x] Add Journal navigation and footer access.
- [x] Research and publish the first substantive article in Production: `shipping-less-javascript-nextjs-16-4`; verify the public route after deployment.
- [x] Confirm Search Console verification and `/sitemap.xml` submission with the owner; inspect the new journal entries after deployment.

### Workstream 5: Resume publishing

- [x] Copy the approved resume into a stable public path.
- [x] Add an indexable resume landing page.
- [x] Add same-origin embedded viewing, direct viewing, and named download actions.
- [x] Add Resume navigation and footer access.
- [x] Override framing headers narrowly for the PDF while retaining the global deny-by-default policy.
- [x] Obtain the owner's confirmation of the resume content on October 30, 2026. Review quarterly and replace the PDF after material resume changes, keeping its public path stable.

### Workstream 6: Verification and release

- [x] Run lint with zero warnings.
- [x] Run strict TypeScript checking.
- [x] Run unit and integration tests.
- [x] Run the production build without local service credentials.
- [x] Run cross-browser Playwright coverage for journal, studio login, and resume routes.
- [x] Verify the database limiter with twelve simultaneous requests and an expired window.
- [x] Verify Preview migrations and editorial workflows against the Preview database.
- [x] Verify Production contact throttling and delivery, published article metadata, RSS, sitemap, native PDF viewing, named download, and private studio create/preview/delete/logout.
- [x] Run `npm run verify:public -- https://faraz-hussain-portfolio.vercel.app` locally and through the hosted Production workflow.
- [x] Remove all eight obsolete Upstash/KV/Redis/salt records from Vercel; delete the disconnected store and uninstall the unused integration.

## Deployment Sequence

1. Approve and provision the Prisma Postgres Production database.
2. Create a separate Prisma Preview database project for the `pre-production` and pull-request workflow.
3. Add Preview `DATABASE_URL`, `RATE_LIMIT_SALT`, `EDITORIAL_STUDIO_PASSWORD`, and `EDITORIAL_STUDIO_SESSION_SECRET` values in Vercel.
4. Deploy the code to Preview; the Vercel build applies the committed migration before compiling.
5. Validate the studio, a draft, a published test post, sitemap output, RSS output, and contact throttling.
6. Add the isolated Production values in Vercel.
7. Merge and deploy Production; verify the migration and application before publishing content.
8. Remove `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `CONTACT_RATE_LIMIT_SALT` from every Vercel environment.
9. Disconnect and delete the Upstash integration only after the Prisma-backed Production route is confirmed.
10. Submit the updated sitemap and inspect `/blog`, `/resume`, and the first article in Google Search Console.

## Rollback Strategy

- Roll back application code through the last known-good Vercel deployment.
- Keep the Prisma database and migration history intact during an application rollback.
- Do not reverse a migration by deleting tables in Production; create a forward corrective migration.
- Retain the Upstash resource until the Prisma Production validation is complete, then remove it as a separate operation.
- After Upstash retirement, roll back only to a verified Prisma-compatible release. A pre-Prisma rollback requires deliberate restoration of its old rate-limit service and secrets; do not assume an old deployment remains operational.
- If editorial publishing fails, keep the public portfolio available and leave the journal in its empty state while correcting the database or studio configuration.

## Release Evidence

Record the final versions, database branch identifiers, migration checksum, quality-gate output, Preview URL, Production verification result, and first published article in `MEMORY.md` after deployment. Do not record connection strings, passwords, session secrets, salts, or visitor-derived identifiers.

### Provisioning evidence: October 30, 2026

- Production project: `proj_u6dh8v8a8ewosnw3z3f8xacw`; database: `db_fuo6i17eje9ovzxtqk0w70hq`.
- Preview project: `proj_rckn38m2zpnpgjyamr9vxu8k`; database: `db_f904s4lcq9lv6kq1izwnmc2h`.
- Both databases are ready in Singapore and report their migration history as up to date.
- Initial migration SHA-256: `4bff4947f76eb3b5e4ef55d519cac007f8aa579d60cf60e8b8e0997304f7516b`.
- Vercel contains separate sensitive values for all four required keys in both Production and Preview.
- Database integration coverage confirms that exactly three of twelve concurrent first requests pass a three-request quota and that expiry starts a fresh window.
- The Vercel build command is pinned in `vercel.json`; CI applies migrations and runs database/browser integration coverage against disposable PostgreSQL 17.
- Final local evidence: lint, strict types, 32 unit tests, 2 database integration tests, production build, 15 Chromium/WebKit/mobile browser checks, and Markdown lint all pass. Browser checks use temporary local HTTPS certificates to exercise Production Secure cookies.
- Generated credentials are retained only in Git-ignored `.local/env/.env.phase06.production.local` and `.local/env/.env.phase06.preview.local` files for the owner to transfer to a password manager.
- PR #11 merged as `48ae576d37fb40bb9789439b4501a72bae9a63a7`; Vercel Production deployment `dpl_5CgcuwWv9VE2zjrfconQZJ52JZR8` passed public and authenticated release checks.
- Upstash retirement completed only after five live contact messages were reported delivered and the sixth request returned HTTP 429 with `Retry-After`. All eight obsolete environment records, the disconnected portfolio store, and the unused integration were removed. The deleted store contained ephemeral throttle state, not articles.
- The release is accepted with one explicit human NVDA/VoiceOver listening-test limitation. Agent keyboard/semantic/axe evidence does not close that checkbox.
