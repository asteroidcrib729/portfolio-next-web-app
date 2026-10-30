# Compliance Operations Runbook

This runbook turns the repository controls into recurring operational practice. It is
not legal advice. The portfolio owner remains responsible for confirming applicable
law, provider contracts, public claims, and the production account configuration.

## Public Release Gate

Before sharing a recruiter-facing URL:

1. In Vercel, open **Project Settings → Deployment Protection**.
2. Keep **Vercel Authentication** enabled with **Standard Protection** so generated
   deployment and preview URLs remain protected while production domains stay public.
3. In **Project Settings → Domains**, keep
   `faraz-hussain-portfolio.vercel.app` as the sole intended public production domain.
4. Confirm `NEXT_PUBLIC_SITE_URL` is exactly
   `https://faraz-hussain-portfolio.vercel.app`.
5. Open the URL in a signed-out/private browser window.
6. Run
   `npm run verify:public -- https://faraz-hussain-portfolio.vercel.app`.
7. Run the GitHub `Public Release Verification` workflow with the same URL.
8. Confirm the canonical URL, sitemap URLs, contact form, privacy page, quality page,
   and analytics choice on the deployed site.

Do not use or exempt a Vercel branch/generated deployment URL as the public portfolio
URL. Its authentication redirect is intentional under Standard Protection.

## Monthly Retention Review

Complete this review at least monthly:

1. Search the configured contact mailbox and Resend activity for messages older than
   12 months after the last substantive exchange.
2. Delete routine messages that have reached the limit from the mailbox, trash,
   archives, exports, and any manual copies.
3. Retain a message longer only for an active engagement, security investigation,
   legal obligation, or dispute; record the reason and next review date privately.
4. Verify that Prisma `RateLimitBucket` records use scope-prefixed HMAC keys, become
   invalid after ten minutes for contact requests, and are pruned after expiry. Never
   store the raw request IP in the key.
5. Review Vercel Analytics retention/account settings. Confirm the default-on public-page
   policy, persistent opt-out, browser privacy-signal handling, and private-route exclusions
   match `/privacy`. Review jurisdiction-specific requirements before expanding collection.
6. Record completion outside the public repository without copying visitor content.

## Privacy Request Procedure

When a request arrives with the subject `Privacy request`:

1. Confirm enough information to locate the contact message without requesting
   unnecessary identity documents.
2. Search Resend activity, the destination mailbox, archives, and authorized copies.
3. Correct, export, or delete the identifiable record as applicable.
4. Reply within the deadline required by the law that actually applies.
5. Record only the request date, completion date, scope, and outcome; do not place the
   original message in this repository.

Escalate uncertain identity, legal holds, conflicting requests, or jurisdictional
questions to qualified counsel.

## Production Contact Configuration

The production contact endpoint intentionally fails closed unless all of these values
exist:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `DATABASE_URL`
- `RATE_LIMIT_SALT`

Use a unique random salt of at least 32 characters, keep all five values server-only,
and rotate credentials after suspected exposure. Confirm the Resend sender is verified
and the destination mailbox has multi-factor authentication.

## Editorial Studio Configuration

The private studio requires these server-only values in addition to `DATABASE_URL`:

- `EDITORIAL_STUDIO_PASSWORD`
- `EDITORIAL_STUDIO_SESSION_SECRET`

Use separate Production and Preview values. The session secret must contain at least
32 random characters, and the author password must contain at least 16 characters.
Confirm `/studio` redirects unauthenticated requests to `/studio/login`, remains
excluded from robots, and issues only HTTP-only, same-site, secure Production cookies.

Preview must use a separate Prisma database project. Never place the Production connection
string in the Vercel Preview environment. Apply committed migrations to Preview first,
verify the editorial workflow, then deploy the same migration to Production.

## Repository Security Automation

Dependabot checks routine npm and GitHub Actions updates weekly and targets `pre-production`. Native security updates use `main`; review them and apply the same migration and release gates before merging. Native vulnerability alerts, security updates, secret scanning, and push protection were verified enabled on October 30, 2026.

Secret Scanning, Dependency Security, and CodeQL run on pull requests, `main`/`pre-production` pushes, a staggered weekly schedule, and manual dispatch. Workflow Validation runs on pull requests, pushes to those branches, and manual dispatch. Public Release Verification runs daily and after successful Production deployment events and can also be dispatched manually. Scheduled runs and Dependabot configuration require the files to be present on the default branch.

Run `npm run security:secrets`, `npm run lint:workflows`, and `npm audit --package-lock-only --audit-level=moderate` locally before security-related releases. Secret scans require full history and cover current tracked and non-ignored pending source changes. Do not upload private environment snapshots or the entire `.local/` directory as CI artifacts. The workflow uploads only failed browser diagnostics produced with disposable CI credentials.
The secret-scanning workflow separately retains its two redacted JSON finding reports for seven days on failure.

Review `.github/security-tools.json` for Gitleaks and Actionlint upgrades quarterly. Verify replacement archive SHA-256 values against official release metadata for both supported platforms. Dependabot maintains pinned Action references; the scanner/linter binary manifest is reviewed separately.

After successful hosted runs establish the check names, configure required status checks in branch rules as appropriate. The workflow files themselves do not change branch rules.

Treat real secret findings as an incident: revoke or rotate the exposed credential, investigate its use, then remove it from current source. History changes require a coordinated, separately approved rewrite. Do not silence a real finding with a blanket path exclusion or baseline.

## Quarterly Technical Review

At least quarterly and before every material feature addition:

- Run `npm run check:full` and `npm audit`.
- Inspect deployed security headers and Content Security Policy violations.
- Run keyboard, zoom, forced-colors, light/dark, reduced-motion, and screen-reader
  checks on current Chrome/Edge, Firefox, and Safari/WebKit.
- Review every analytics, logging, error-monitoring, embed, form, and external-resource
  change against the privacy notice.
- Recalculate text and non-text contrast after token changes.
- Review `ASSET-PROVENANCE.md`, `THIRD_PARTY_NOTICES.md`, and dependency licenses.
- Revalidate all public skill, availability, performance, accessibility, and project
  claims against retained evidence.

Automated axe-core and Playwright results are regression evidence, not a substitute
for assistive-technology testing or a WCAG conformance assessment.
