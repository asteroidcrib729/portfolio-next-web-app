# Faraz Hussain Portfolio

A recruiter-focused full-stack engineering portfolio built as a product-quality case study. The site demonstrates server-first React architecture, responsive interaction design, accessible motion and navigation, typed content modeling, privacy-aware analytics, resilient contact handling, and automated release checks.

## Technology

- Next.js 16 App Router and React 19
- TypeScript in strict mode with React Compiler
- Tailwind CSS 4 and semantic design tokens
- Motion for reduced-motion-aware transitions
- `next-themes` for persistent system, light, and dark themes
- Self-hosted Geist Sans and Geist Mono
- Vitest and Testing Library

## Local Development

Requirements:

- Node.js 24
- npm 11 or a compatible npm version from Node.js 24

Install and start the project:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Run every release check in sequence with:

```bash
npm run check
```

The cross-browser Playwright suite is intentionally separate because it starts the
production server and requires installed browser binaries:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
```

Run `npm run check:full` after the production build exists and the browser binaries
are installed.

The production build does not download Google Fonts. The `geist` package provides versioned local font assets, so clean builds remain deterministic in restricted-network environments.

## Content Configuration

Public portfolio content lives in `src/data/siteConfig.ts`. It is the source of truth for:

- Identity and positioning
- Navigation and social links
- Capability categories
- Case studies
- Engineering approach
- Contact details

Optional profile links and the production canonical URL are configured through environment variables. Copy `.env.example` to `.env.local` and replace its example values:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-handle
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-handle
NEXT_PUBLIC_X_URL=https://x.com/your-handle
NEXT_PUBLIC_REPOSITORY_URL=https://github.com/your-handle/portfolio
```

Unset social profiles are omitted from the interface instead of rendering broken or generic links.

## Contact Delivery

The contact form validates input in the browser and again in `src/app/api/contact/route.ts`. Production delivery uses the Resend REST API:

```dotenv
RESEND_API_KEY=re_your_api_key
CONTACT_TO_EMAIL=you@your-domain.com
CONTACT_FROM_EMAIL=Portfolio <portfolio@your-verified-domain.com>
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
CONTACT_RATE_LIMIT_SALT=replace-with-at-least-32-random-characters
```

Production delivery fails closed unless distributed throttling is configured. The
limiter stores only an HMAC-pseudonymized request identifier and expires its counter
after ten minutes. Local development and tests use a bounded, automatically pruned
in-memory fallback.

If direct delivery is unavailable, the interface offers an explicit blank email draft.
It never places the submitted name, address, subject, or message into a URL. The
visitor chooses what to copy.

Routine enquiry retention is capped at 12 months after the last substantive exchange,
subject to the narrow exceptions stated in the privacy notice. Follow
`development-plans/COMPLIANCE-OPERATIONS.md` to enforce mailbox and provider deletion.

## Architecture

```text
src/
├── app/
│   ├── api/contact/route.ts
│   ├── layout.tsx
│   ├── manifest.ts
│   ├── opengraph-image.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── common/
│   ├── layout/
│   ├── providers/
│   └── sections/
├── data/siteConfig.ts
├── lib/utils.ts
├── test/setup.ts
└── types/index.ts
```

The page remains server-rendered by default. Client boundaries are limited to theme state, the mobile navigation, skill filtering, form behavior, and viewport animation.

## Accessibility

- Semantic landmarks and labelled sections
- Keyboard-contained mobile navigation with focus restoration
- Visible focus states and 44-pixel minimum interactive targets
- WCAG-oriented light and dark token pairings
- `prefers-reduced-motion` support in CSS and Motion components
- Live regions for asynchronous form status
- A focus-visible skip link and forced-colors support
- Automated axe-core semantic checks and cross-browser Playwright coverage
- Automated text and non-text token contrast assertions

Automated testing does not constitute WCAG certification. The public `/quality` page
states the current evidence and its limitations.

## Privacy and Security

- Vercel Web Analytics is disabled by default and loads only after an explicit choice
  on `/privacy`.
- The visitor can withdraw that preference on the same page; a live event filter
  blocks subsequent analytics events after withdrawal.
- Contact responses are non-cacheable, validate body type and size, escape generated
  HTML, and apply a timeout to provider calls.
- Production contact throttling uses expiring pseudonymous counters rather than raw IP
  keys.
- Global headers enforce a Content Security Policy, framing restrictions, MIME
  protection, a strict referrer policy, feature restrictions, HSTS, and cross-origin
  isolation where compatible.
- `X-Powered-By` is disabled.

The CSP permits inline scripts and styles required by the current static Next.js and
theme implementation. It still restricts origins, objects, framing, forms, media, and
browser capabilities. Reassess the policy whenever a dependency or external service
is introduced.

## Deployment

Set the environment variables above in the deployment platform, run
`npm run check:full`, and deploy the Next.js application to a Node-compatible host.
The generated metadata routes include the web manifest, Open Graph image, robots file,
and sitemap.

For the recruiter-facing Vercel release, keep **Vercel Authentication** enabled with
**Standard Protection**. This leaves the assigned production domain public while
protecting generated deployment and preview URLs. Keep
`https://faraz-hussain-portfolio.vercel.app` as the sole intended public production
domain, and verify it from a signed-out context:

```bash
npm run verify:public -- https://faraz-hussain-portfolio.vercel.app
```

The check fails on Vercel authentication redirects, `noindex`, non-HTTPS URLs, HTTP
errors, or content that is not this portfolio. The `Public Release Verification`
workflow exposes the same check as a manual GitHub Actions release gate.

Review the privacy notice, 12-month retention commitment, public identity, provider
contracts, and production settings before launch. The repository's technical controls
do not replace jurisdiction-specific legal advice.
