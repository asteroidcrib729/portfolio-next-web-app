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
- Upstash Redis for distributed production throttling
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

The site still renders when optional service credentials are absent. In that state, the contact form returns a safe mail-client fallback, distributed throttling remains unavailable, and analytics stay disabled.

My production build does not download Google Fonts. The versioned local assets supplied by the `geist` package keep clean builds deterministic in restricted-network environments.

## Quality Control

I keep the main verification tasks available as individual scripts:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

For the standard local quality gate, I run:

```bash
npm run check
```

To include the production build and every configured browser project, I run:

```bash
npx playwright install chromium firefox webkit
npm run check:full
```

After deployment, I verify the public host, redirects, crawler files, metadata, and security headers with:

```bash
npm run verify:public -- https://faraz-hussain-portfolio.vercel.app
```

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

## Contact Delivery

I validate contact submissions on the server before delivering them through Resend. The route applies field and body-size limits, a honeypot, non-cacheable responses, provider timeouts, and rate limiting. When I configured Upstash, production throttling started using an HMAC-pseudonymous client identifier instead of storing a raw network address.

```env
RESEND_API_KEY=re_your_api_key
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Portfolio <portfolio@your-verified-domain.example>
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
CONTACT_RATE_LIMIT_SALT=replace-with-at-least-32-random-characters
```

I require distributed throttling in production and fail closed when it is unavailable. The limiter stores only an HMAC-pseudonymized request identifier, expires its counter after ten minutes, and uses a bounded, automatically pruned in-memory fallback during local development and testing.

When delivery is unavailable, I offer an explicit blank email draft instead of exposing provider or configuration details. I never place the submitted name, address, subject, or message in a URL; the visitor decides what to copy.

I cap routine enquiry retention at 12 months after the last substantive exchange, subject to the narrow exceptions stated in the privacy notice. I use `development-plans/COMPLIANCE-OPERATIONS.md` to guide mailbox and provider deletion.

## Architecture

I have organized the project around route composition, reusable interface primitives, focused page sections, typed content, and isolated operational helpers:

```text
src/
|-- app/
|   |-- api/contact/route.ts
|   |-- privacy/page.tsx
|   |-- quality/page.tsx
|   |-- layout.tsx
|   |-- page.tsx
|   |-- robots.ts
|   `-- sitemap.ts
|-- components/
|   |-- common/
|   |-- layout/
|   |-- providers/
|   `-- sections/
|-- data/siteConfig.ts
|-- lib/
|   |-- analyticsPreference.ts
|   |-- contactRateLimit.ts
|   |-- seo.ts
|   `-- utils.ts
|-- test/setup.ts
`-- types/index.ts
```

Using server-rendered page composition keeps the main experience lightweight, while narrowly scoped client components handle theme state, mobile navigation, animation, filtering, analytics preferences, and contact-form interaction.

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

I have kept analytics off until a visitor explicitly enables the preference on `/privacy`. The setting is reversible, and my withdrawal filter prevents newly queued analytics events from being sent after consent is removed.

I have also applied an enforced Content Security Policy, modern browser security headers, same-origin contact validation, bounded request processing, production-safe error responses, and protected source maps. The repository includes licensing, asset provenance, third-party notices, a dated quality-evidence page, and an operational release runbook.

My current Content Security Policy permits the inline scripts and styles required by the static Next.js and theme implementation while restricting origins, objects, framing, form targets, media, and browser capabilities. I reassess that policy whenever I introduce a dependency or external service.

These controls strengthen the application, but they do not by themselves establish legal compliance for every operator, jurisdiction, deployment, or data-processing arrangement.

## Deployment

I have deployed the site with Node.js 24. Before releasing it, I configured the required environment variables, run `npm run check:full`, and validated the public deployment with `npm run verify:public`. The generated metadata routes include the web manifest, Open Graph image, robots file, and sitemap.

My sole intended public production origin is:

```text
https://faraz-hussain-portfolio.vercel.app
```

I use Vercel Standard Protection to require authentication on generated preview and deployment URLs. Only the production domain above is intended for anonymous access.

My public verification script fails on Vercel authentication redirects, `noindex`, non-HTTPS URLs, HTTP errors, or content that does not identify this portfolio. The `Public Release Verification` GitHub Actions workflow provides the same check as a manual release gate.

## Google Search Indexing

I published indexable production metadata, a canonical URL, `robots.txt`, an absolute sitemap, social previews, and `ProfilePage`, `Person`, and `WebSite` structured data.

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
