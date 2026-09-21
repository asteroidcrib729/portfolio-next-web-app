# Development Plan 05: Signature Portfolio Experience and Production Launch

## 1. Executive Summary

The issue-remediation release establishes a complete, accessible, tested portfolio foundation. The next phase is not a repair phase. It is a differentiation phase focused on the evidence, interactions, case-study depth, and release discipline required to make the site a credible standalone demonstration of elite frontend craft.

The design principle for this phase is **progressive impressiveness**: the first screen must communicate confidence immediately, the first 90 seconds must give a recruiter a complete professional signal, and deeper exploration must reward technical reviewers without slowing down or obscuring the core narrative.

## 2. Current Baseline

The following capabilities are complete before this plan begins:

- Six responsive portfolio sections assembled through a server-first page architecture.
- Accessible light/dark theming with self-hosted Geist typography.
- Reduced-motion-aware reveals and interactive skill filtering.
- Focus-managed mobile navigation and consistent interaction targets.
- Typed portfolio data, transparent case studies, and a functioning contact path.
- Client and server contact validation with Resend delivery support and mail fallback.
- Canonical metadata, generated Open Graph artwork, manifest, robots rules, and sitemap.
- ESLint, strict TypeScript, Vitest, Testing Library, and GitHub Actions checks.

## 3. Product Outcomes

### 3.1 Recruiter Outcome

A recruiter should understand the following within 90 seconds:

- Who Faraz is and the frontend problems he is equipped to solve.
- What makes his product and interface judgment distinctive.
- Which real projects demonstrate those capabilities.
- How to inspect proof, download a resume, and make contact.

### 3.2 Engineering Reviewer Outcome

A frontend engineer should be able to verify:

- Intentional server/client boundaries and maintainable component APIs.
- Strong accessibility, performance, testing, and failure-state discipline.
- Real project decisions with constraints, alternatives, and measurable outcomes.
- Animation and visual effects that degrade gracefully and respect user preferences.

### 3.3 Experience Outcome

The experience should feel authored rather than assembled from a portfolio template. Distinctive interactions must support navigation, comprehension, or proof; decorative complexity that harms speed or clarity is out of scope.

## 4. Feature and Improvement Initiatives

### 4.1 Verified Professional Narrative

Replace the current repository-derived positioning with owner-approved material:

- Final biography, location preference, availability, and role targets.
- Verified employment and education timeline.
- Real GitHub, LinkedIn, X, scheduling, and production-domain URLs.
- Resume PDF with a visible last-updated date.
- Quantified project outcomes supported by source material.
- Optional testimonials only when attribution and publication approval are confirmed.

No invented metric, client, employer, testimonial, or project result may be published.

### 4.2 Deep Project Case Studies

Create statically generated `/work/[slug]` routes for three to five flagship projects. Each case study should include:

- Context, audience, constraints, and personal responsibility.
- Before/after framing or a clear problem-to-outcome narrative.
- Architecture diagram and key component/data-flow decisions.
- Difficult frontend problem, explored alternatives, and tradeoff rationale.
- Accessible responsive screenshots or short optimized video clips.
- Performance, accessibility, or business evidence where verified.
- Source and live-product links when disclosure permits.
- Previous/next navigation and related-capability links.

Extend the project model with `slug`, `summary`, `role`, `year`, `media`, `challenge`, `approach`, `outcome`, and optional verified metrics.

### 4.3 Signature Interaction Layer

Add a restrained interaction system with one memorable signature element:

- Pointer spotlight on fine-pointer devices only.
- Active-section navigation with an unobtrusive reading-progress indicator.
- Command palette opened by `Ctrl+K` or `Command+K` for navigation, theme, resume, and contact actions.
- Project-card media preview on hover/focus with an equivalent touch interaction.
- Optional interactive architecture map that connects product intent, component systems, quality checks, and deployment output.

Every feature must provide keyboard behavior, touch behavior, reduced-motion behavior, and a no-JavaScript-safe core path.

### 4.4 Recruiter Conversion Features

- Add persistent but non-intrusive resume and contact actions in desktop navigation.
- Provide a recruiter summary panel with role target, location/remote preference, core stack, and availability.
- Add a downloadable and printable resume with tracked but privacy-respecting interaction events.
- Add a verified scheduling link if the owner uses a scheduling service.
- Provide copyable project and contact URLs with clear confirmation feedback.
- Add a compact "currently building" signal backed by real repository or project activity.

### 4.5 Visual Storytelling and Media

- Define a project art direction with consistent device frames, annotation language, and image treatment.
- Produce responsive AVIF/WebP assets with intrinsic dimensions and blur placeholders.
- Use `next/image` for all content imagery and poster frames for video.
- Add subtle depth through layered gradients, borders, and lighting without reducing text contrast.
- Create a favicon and social-preview family that matches the FH identity system.
- Ensure the light theme receives the same level of art direction as the dark theme.

### 4.6 Navigation and Information Architecture

- Add active scrollspy state to desktop navigation.
- Preserve a canonical URL for every case study and meaningful state.
- Add breadcrumb navigation on case-study pages.
- Add skip-to-content and skip-to-projects links.
- Ensure browser Back and Forward behavior remains correct for overlays and filtered views.
- Consider URL-backed project filters only if the resulting states are worth sharing.

### 4.7 Performance and Observability

- Capture Web Vitals in production and establish a lightweight performance dashboard.
- Analyze client bundles and lazy-load non-critical interaction modules.
- Defer pointer effects and media previews until the browser is idle or intent is shown.
- Preload only the hero assets required for the initial viewport.
- Add a performance-budget check to CI for the home route and case-study template.
- Test on a mid-range mobile device profile and a throttled network, not only a development workstation.

### 4.8 Accessibility and Inclusive UX

- Add automated axe coverage and Playwright keyboard journeys.
- Test Windows High Contrast Mode, 200% zoom, text-only zoom, and forced colors.
- Verify screen-reader output for navigation, filters, project media, form errors, and dynamic status.
- Add explicit error summaries and field-level messages to the contact form.
- Test reduced transparency in addition to reduced motion where visual layering affects legibility.
- Conduct a manual WCAG 2.2 AA review before release.

### 4.9 Security, Privacy, and Reliability

- Replace the in-memory contact limit with distributed rate limiting at the platform or data layer.
- Add a Content Security Policy, Referrer Policy, Permissions Policy, and explicit frame protection.
- Add structured server logging that excludes message bodies and personal data.
- Define contact-data retention and deletion behavior.
- Add error monitoring with source maps protected from public enumeration.
- Document graceful degradation when analytics, email delivery, media, or JavaScript fails.

### 4.10 Search and Structured Data

- Add JSON-LD for `Person`, `WebSite`, and verified `CreativeWork` projects.
- Create per-case-study metadata and social artwork.
- Validate canonical URLs in preview and production environments.
- Submit the sitemap only after the production domain is configured.
- Add a human-readable `humans.txt` only if it contributes meaningful authorship context.

## 5. Proposed Architecture Additions

```text
src/
├── app/
│   ├── work/
│   │   └── [slug]/
│   │       ├── opengraph-image.tsx
│   │       └── page.tsx
│   └── resume/
│       └── page.tsx
├── components/
│   ├── case-study/
│   │   ├── ArchitectureDiagram.tsx
│   │   ├── CaseStudyHero.tsx
│   │   ├── DecisionRecord.tsx
│   │   ├── ProjectMedia.tsx
│   │   └── ProjectPagination.tsx
│   ├── command/
│   │   └── CommandPalette.tsx
│   ├── common/
│   │   ├── SkipLinks.tsx
│   │   └── VisuallyHidden.tsx
│   └── effects/
│       ├── PointerSpotlight.tsx
│       └── ReadingProgress.tsx
├── data/
│   ├── projects/
│   └── siteConfig.ts
├── hooks/
│   ├── useMediaQuery.ts
│   └── useScrollSpy.ts
└── lib/
    ├── analytics.ts
    ├── metadata.ts
    └── structuredData.ts
```

Add dependencies only when a native platform or existing-library solution would materially increase maintenance risk. Each new client dependency requires a bundle-cost note in the pull request.

## 6. Phased Execution Checklist

### Phase 5.1: Content and Evidence Intake

- [ ] Obtain and approve the professional biography, resume, social profiles, employment history, and role target.
- [ ] Select three to five real flagship projects and collect source material.
- [ ] Verify every metric, testimonial, client name, and publication permission.
- [ ] Define the recruiter summary and primary conversion action.

### Phase 5.2: Case-Study Platform

- [ ] Extend the project schema and add slug-based static routes.
- [ ] Build the reusable case-study component set.
- [ ] Add responsive project media and architecture diagrams.
- [ ] Implement project pagination, breadcrumbs, and metadata.
- [ ] Add content-integrity tests for every published project.

### Phase 5.3: Signature Interaction and Navigation

- [ ] Add scrollspy navigation and reading progress.
- [ ] Build the accessible command palette.
- [ ] Implement the chosen signature interaction for pointer, keyboard, and touch.
- [x] Add a focus-visible skip-to-main link.
- [ ] Add resume/contact navigation actions.
- [ ] Verify Back, Forward, deep-link, and reduced-motion behavior.

### Phase 5.4: Recruiter Conversion and Production Services

- [ ] Publish the approved resume experience and downloadable PDF.
- [ ] Configure verified profile, scheduling, canonical-domain, and contact-delivery values.
- [x] Require privacy-preserving distributed contact throttling in production.
- [x] Add default-off, reversible privacy-respecting analytics.
- [ ] Add Web Vitals and error monitoring with the same disclosure discipline.
- [x] Add profile, person, and website structured data.
- [ ] Add per-project social previews.

### Phase 5.5: Quality and Performance Certification

- [x] Add Playwright journeys for desktop, mobile, keyboard, theme, and privacy choices.
- [ ] Add Playwright work-route and live contact-delivery journeys.
- [x] Add automated axe checks.
- [ ] Add screenshot-based visual regression.
- [ ] Add bundle and Lighthouse budgets to CI.
- [ ] Test Chromium, Firefox, and WebKit at required breakpoints.
- [ ] Complete manual WCAG 2.2 AA and screen-reader review.
- [ ] Validate failure modes with JavaScript, email, analytics, and media unavailable.

### Phase 5.6: Launch and Iteration

- [ ] Configure preview and production deployments with environment separation.
- [ ] Validate metadata, redirects, sitemap, security headers, and contact delivery on production.
- [ ] Capture a pre-launch performance baseline on real mobile hardware.
- [ ] Complete stakeholder review and content sign-off.
- [ ] Launch, monitor the first seven days, and triage evidence-based improvements.

## 7. Release Quality Budgets

| Area | Target |
| --- | --- |
| Lighthouse performance | At least 95 on representative mobile runs |
| Lighthouse accessibility | 100, with manual WCAG 2.2 AA verification |
| Largest Contentful Paint | At most 2.0 seconds at the 75th percentile |
| Interaction to Next Paint | At most 150 milliseconds at the 75th percentile |
| Cumulative Layout Shift | At most 0.05 at the 75th percentile |
| Initial-route JavaScript | Target at most 150 KB compressed; exceptions require justification |
| Automated accessibility | Zero serious or critical axe violations |
| Keyboard coverage | Every action reachable, operable, visible, and escapable |
| Build quality | Lint, types, unit tests, end-to-end tests, and production build all pass |

## 8. Guardrails

- Do not trade legibility or load time for visual novelty.
- Do not publish fabricated professional evidence.
- Do not make core navigation depend on animation, pointer precision, or sound.
- Do not autoplay audio or long-form video.
- Do not introduce a heavy 3D runtime on the primary route without a measured performance case and a static fallback.
- Do not collect analytics or contact data without a documented purpose and retention policy.
- Do not add a dependency when the browser platform or existing stack solves the problem cleanly.

## 9. Definition of Done

Phase 5 is complete when the production site contains verified professional content and deep real-project evidence; provides a memorable but inclusive interaction layer; passes the stated performance, accessibility, security, and test gates; and gives a recruiter a clear path from first impression to resume, proof, and contact without ambiguity or friction.
