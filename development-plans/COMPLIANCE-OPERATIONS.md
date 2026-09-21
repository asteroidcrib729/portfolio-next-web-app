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
4. Verify that Upstash rate-limit keys use the `portfolio:contact:` prefix and a
   ten-minute TTL. Never store the raw request IP in the key.
5. Review Vercel Analytics retention/account settings and confirm analytics remains
   disabled until the visitor opts in.
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
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CONTACT_RATE_LIMIT_SALT`

Use a unique random salt of at least 32 characters, keep all six values server-only,
and rotate credentials after suspected exposure. Confirm the Resend sender is verified
and the destination mailbox has multi-factor authentication.

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
