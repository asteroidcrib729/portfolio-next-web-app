# Recommended Codebase Solutions

## Purpose

Each solution below maps directly to an issue in `ISSUES.md`. The order reflects the recommended implementation sequence: make the portfolio truthful and complete first, then close accessibility and reliability gaps, establish automated quality gates, and finish documentation cleanup.

## Implementation Status

All twelve solution groups were implemented on 2026-09-10. Owner confirmation of the public biography and final production environment values remains a launch prerequisite rather than a source-code defect. The newest feature roadmap is documented in `development-plan-05.md`.

## Solution Summary

| Solution | Resolves | Priority | Recommended outcome |
| --- | --- | --- | --- |
| SOL-001 | ISS-001 | Immediate | Replace all sample identity, URLs, history, projects, and claims with verified owner data. |
| SOL-002 | ISS-002 | Immediate | Implement and assemble all six planned section components. |
| SOL-003 | ISS-003 | High | Add component, interaction, end-to-end, and CI coverage. |
| SOL-004 | ISS-004 | High | Make the mobile menu keyboard-safe, stateful, and non-destructive. |
| SOL-005 | ISS-005 | High | Adopt an accessible light accent and verify every token pairing. |
| SOL-006 | ISS-006 | High | Add a shared reduced-motion policy in CSS and Motion components. |
| SOL-007 | ISS-007 | Medium | Self-host fonts or deliberately use system fonts for hermetic builds. |
| SOL-008 | ISS-008 | Medium | Implement owner-specific metadata, crawler files, and preview assets. |
| SOL-009 | ISS-009 | Medium | Version the development-plans directory or explicitly document local-only intent. |
| SOL-010 | ISS-010 | Medium | Replace boilerplate docs and reconcile all roadmap terminology and status. |
| SOL-011 | ISS-011 | Low | Normalize external-link behavior, touch targets, focus rings, and icon semantics. |
| SOL-012 | ISS-012 | Low | Centralize icon rendering and clean unused assets/dependency state. |

## Detailed Solutions

### SOL-001: Replace and Validate Portfolio Content

Collect approved source-of-truth content from the portfolio owner and update `siteConfig.ts` in one pass:

- Real name, title, location, status, email, and biography.
- Profile-specific GitHub, LinkedIn, and X URLs.
- Real project repository/demo URLs, screenshots, responsibilities, and outcomes.
- Accurate employment history, employer URLs, dates, locations, and technologies.
- Quantified claims backed by evidence; remove any metric that cannot be substantiated.

Add a lightweight content validation test that rejects `example.com`, root social domains, empty strings, duplicate IDs, and unsupported URL protocols.

Acceptance criteria:

- No placeholder domain, identity, company, project, or unsupported claim remains.
- Every visible link reaches its intended destination.
- The owner has reviewed all public claims.

### SOL-002: Complete the Section Architecture

Follow `development-plan-04.md` and create:

- `src/components/sections/Hero.tsx`
- `src/components/sections/About.tsx`
- `src/components/sections/Skills.tsx`
- `src/components/sections/Projects.tsx`
- `src/components/sections/Experience.tsx`
- `src/components/sections/Contact.tsx`

Move hero markup out of `page.tsx`, consume all typed datasets, use `SectionHeading` consistently, and keep `page.tsx` as a simple assembly layer. Give each section a stable ID and `scroll-mt-16` or equivalent so sticky navigation does not cover its heading. For the contact form, choose and document a real delivery mechanism, server-side validation, spam protection, error handling, and privacy behavior before enabling submission.

Acceptance criteria:

- All navigation targets render substantive content instead of phase placeholders.
- All current data exports are intentionally consumed or removed.
- Contact submission has a verified success and failure path.

### SOL-003: Establish Automated Testing and CI

Add a staged test strategy:

- Vitest and React Testing Library for component behavior, content mapping, and theme/menu state.
- Automated accessibility assertions with `axe-core` or an equivalent test integration.
- Playwright for keyboard navigation, mobile-menu focus, anchor scrolling, theme persistence, broken links, and contact submission.
- A CI workflow that runs a clean install, lint, TypeScript, tests, and production build on pull requests.

Add explicit `typecheck`, `test`, `test:e2e`, and optionally `check` scripts to `package.json` so local and CI commands match.

Acceptance criteria:

- Pull requests cannot merge when lint, typing, tests, or build fail.
- Critical navigation and theme flows have regression coverage.
- CI starts from `npm ci`, not the developer's existing `node_modules` state.

### SOL-004: Harden Mobile Navigation

Treat the overlay as a controlled disclosure or modal navigation:

- Add a stable overlay ID, `aria-expanded`, and `aria-controls` to the trigger.
- Give the navigation an accessible label.
- Close on Escape and after selecting a link.
- Move focus to the first menu item on open, constrain focus while open, and restore focus to the trigger on close.
- Preserve the previous body overflow value and restore that exact value during cleanup.
- Consider a native `dialog` with carefully tested semantics or a small established focus-management primitive if hand-written trapping becomes complex.

Acceptance criteria:

- The entire flow works with keyboard alone and common screen readers.
- Tabbing cannot reach obscured page controls while the overlay is open.
- Opening and closing does not corrupt pre-existing body scroll state.

### SOL-005: Correct the Accent Palette

Replace the light accent with a darker blue that reaches at least 4.5:1 against light surfaces. For example, `#0369a1` has substantially stronger contrast against white and supports white foreground text more reliably than the current cyan. Do not accept a candidate solely by visual inspection.

Audit these combinations with an automated contrast checker:

- Accent text on background, card, and muted surfaces.
- Accent foreground on solid accent controls.
- Focus rings and borders against adjacent colors.
- Muted text in both themes.

Acceptance criteria:

- Normal text reaches at least 4.5:1.
- Large text and meaningful non-text states reach at least 3:1.
- Light and dark token combinations are included in an accessibility regression test.

### SOL-006: Honor Reduced-Motion Preferences

Add a global `@media (prefers-reduced-motion: reduce)` rule that disables smooth scrolling, minimizes non-essential transition duration, and stops continuous decorative animation. In Motion components, use the library's reduced-motion hook or configuration to replace large transforms and staggered movement with an instant or subtle opacity-only state.

Decorative status dots should be static for reduced-motion users. Functional feedback must remain understandable without animation.

Acceptance criteria:

- Enabling reduced motion stops pulsing and smooth scrolling.
- Planned section animations have a no-motion or minimal-motion variant.
- No interaction depends on animation to communicate state.

### SOL-007: Make Font Loading Hermetic

Preferred approach: commit licensed Geist font files and load them with `next/font/local`. If repository size or licensing policy makes that undesirable, remove `next/font/google` and use a documented system-font stack. Keep remote Google fonts only if network access is an explicit, monitored CI prerequisite.

Acceptance criteria:

- A clean production build succeeds without outbound network access.
- Font files and licenses are documented and versioned when self-hosted.
- There is no layout shift caused by an unplanned fallback.

### SOL-008: Complete SEO and Sharing Metadata

Drive metadata from verified site configuration and add:

- Owner-specific default title, title template, and description.
- Production `metadataBase`, canonical URL, keywords only where useful, authorship, and creator data.
- Open Graph and X/Twitter card fields with a purpose-built preview image.
- `src/app/robots.ts`, `src/app/sitemap.ts`, and optionally `manifest.ts`.
- Per-project metadata later if projects receive dedicated routes.

Acceptance criteria:

- Search snippets and link previews show the correct owner and production URL.
- Sitemap and robots endpoints build and return valid content.
- Preview assets are tested at their target aspect ratio.

### SOL-009: Resolve the Git Ignore Conflict

Remove `development-plans/` from `.gitignore` so plans and analysis reports can be reviewed and committed. If the directory intentionally contains private material, split it into a versioned public planning directory and a clearly named ignored private-notes directory rather than silently ignoring everything.

Acceptance criteria:

- `git status --short` shows changes to the three requested analysis files.
- A fresh clone contains the plans needed to understand project decisions.
- Any confidential planning content has a separate, explicit storage policy.

### SOL-010: Reconcile Documentation

Replace the default README with project-specific documentation covering purpose, current maturity, prerequisites, npm commands, source layout, content editing, testing, build network/font behavior, and deployment. Update older plans to use Motion rather than Framer Motion, Tailwind v4 CSS-first configuration rather than `tailwind.config.ts`, and the actual formatter policy. Check completed master-roadmap tasks and reference the detailed phase plans instead of duplicating stale instructions.

Acceptance criteria:

- README commands and paths work from a clean clone.
- All plans agree on the selected libraries and configuration model.
- Roadmap checkboxes accurately reflect completed work.

### SOL-011: Normalize Link Interaction

Create a shared social-link component that:

- Uses `target="_blank"` and `rel="noopener noreferrer"` only for HTTP(S) destinations intended to open separately.
- Leaves `mailto:` links in the current browsing context.
- Provides at least a 44-by-44-pixel interactive area in the hero and footer.
- Adds a visible `focus-visible` ring consistent with buttons.
- Marks decorative nested SVGs `aria-hidden="true"` and keeps the accessible name on the anchor.

Acceptance criteria:

- Email launches without creating an unnecessary blank tab.
- Pointer and keyboard targets are consistent and clearly visible.
- Automated accessibility checks report no unnamed or duplicate graphic announcements.

### SOL-012: Clean Code and Installed Dependencies

Replace duplicated icon switches with an exhaustive typed map keyed by `SocialLink["icon"]`, ideally inside the shared social-link component. Remove unused starter SVGs once confirmed unnecessary. Retain `motion` and the enriched data only while Phase 3 implementation is active; otherwise remove dormant dependencies and exports until needed.

Recreate dependency state with `npm ci` in a clean environment. Use `npm prune` only if the existing local installation must be repaired, then confirm `npm ls --depth=0` no longer reports extraneous packages.

Acceptance criteria:

- Social icon handling has one typed implementation with exhaustive coverage.
- No unexplained starter assets or dormant production dependencies remain.
- A clean install, lint, typecheck, test suite, and production build all pass.

## Recommended Execution Order

1. Approve and install truthful production content.
2. Implement the missing sections and contact delivery path.
3. Fix contrast, reduced motion, mobile navigation, and link accessibility.
4. Self-host fonts and complete SEO assets.
5. Add tests and enforce all checks in CI.
6. Version and reconcile the repository documentation.
7. Finish low-risk cleanup and rerun every quality gate.
