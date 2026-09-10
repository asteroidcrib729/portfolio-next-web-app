# Faraz Hussain Portfolio

A recruiter-focused frontend portfolio built as a product-quality case study. The site demonstrates server-first React architecture, responsive interaction design, accessible motion and navigation, typed content modeling, resilient contact handling, and automated release checks.

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
```

If server delivery is not configured, the form opens the visitor's mail application with their message prefilled. A honeypot and a basic per-instance request limit reduce automated abuse. For high-traffic deployment, enforce distributed rate limiting at the hosting or data layer.

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

## Deployment

Set the environment variables above in the deployment platform, run `npm run check`, and deploy the Next.js application to a Node-compatible host. The generated metadata routes include the web manifest, Open Graph image, robots file, and sitemap.
