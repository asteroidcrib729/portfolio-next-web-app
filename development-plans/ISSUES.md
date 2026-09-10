# Codebase Issues and Flaws

## Assessment Basis

This issue register was produced from a full scan of the tracked application source, configuration, package manifest and lockfile, repository documentation, and local development plans on 2026-09-10. It also incorporates live ESLint, TypeScript, Next.js build, dependency-tree, and npm audit results.

## Remediation Status

The remediation implementation completed on 2026-09-10. The detailed findings below preserve the original scan evidence; this table records their current disposition.

| ID | Status | Resolution evidence |
| --- | --- | --- |
| ISS-001 | Resolved, owner review required | Repository-owner identity replaces the fictional profile; generic social links are omitted unless configured; project and experience content now describes implemented work without invented employers or metrics. |
| ISS-002 | Resolved | Six section components replace every placeholder and consume the typed content datasets. |
| ISS-003 | Resolved | Vitest, Testing Library, content/interaction tests, npm scripts, and a GitHub Actions quality gate are present. |
| ISS-004 | Resolved | Mobile navigation exposes state, contains focus, handles Escape, restores focus, and preserves prior body overflow. |
| ISS-005 | Resolved | The light accent changed to `#0369a1`, with readable foreground pairings. |
| ISS-006 | Resolved | CSS and Motion components honor `prefers-reduced-motion`. |
| ISS-007 | Resolved | Geist is self-hosted through the versioned `geist` package; a restricted-network build succeeds. |
| ISS-008 | Resolved | Canonical, Open Graph, X/Twitter, manifest, robots, sitemap, and generated preview-image metadata are implemented. |
| ISS-009 | Resolved | `development-plans/` is no longer ignored and its documents appear in normal Git status. |
| ISS-010 | Resolved | README, AGENTS, and active plan status now match the implementation and selected stack. |
| ISS-011 | Resolved | Shared social anchors normalize mail/external behavior, focus styles, touch targets, and icon semantics. |
| ISS-012 | Resolved with local-install note | Duplicate icon logic and starter assets were removed; previously dormant code is used. npm still labels optional WASM packages as extraneous locally after `npm prune`, so CI uses `npm ci` as the authoritative clean-install check. |

Severity meanings:

- **High:** blocks an honest, complete, or reliably verifiable production portfolio.
- **Medium:** creates an accessibility, reliability, discoverability, or maintainability risk.
- **Low:** produces avoidable friction or technical debt without blocking the current scaffold.

## Summary

| ID | Severity | Finding |
| --- | --- | --- |
| ISS-001 | High | Public-facing identity, claims, and URLs are placeholder data. |
| ISS-002 | High | Most portfolio sections are placeholders and enriched datasets are not rendered. |
| ISS-003 | Medium | There are no automated tests or continuous-integration checks. |
| ISS-004 | Medium | The mobile navigation lacks complete accessible-menu behavior and safe state restoration. |
| ISS-005 | Medium | The light-theme accent fails WCAG contrast for text. |
| ISS-006 | Medium | Global and repeated motion does not honor reduced-motion preferences. |
| ISS-007 | Medium | A cold production build depends on access to Google Fonts. |
| ISS-008 | Medium | SEO and social-sharing metadata are generic and incomplete. |
| ISS-009 | Medium | All planning and analysis documents are ignored by Git. |
| ISS-010 | Medium | Repository documentation and older plans have drifted from the implementation. |
| ISS-011 | Low | Social-link behavior, target sizing, and focus treatment are inconsistent. |
| ISS-012 | Low | Unused code/assets and an unclean installed dependency tree add maintenance noise. |

## Original Detailed Findings

### ISS-001: Placeholder Public Content

`src/data/siteConfig.ts` uses the sample identity Alex Morgan, an `example.com` email address, root-domain social URLs, root GitHub URLs, example demo and employer URLs, and apparently illustrative companies, projects, and performance claims. These values are already rendered in the hero, navigation, and footer.

Impact:

- Publishing the current page would misrepresent identity and experience.
- Root-domain and example links send visitors to irrelevant destinations.
- Unverified quantified claims can damage credibility.
- The email call to action cannot reach the actual portfolio owner.

### ISS-002: Incomplete Page Sections and Dead Data Path

`src/app/page.tsx` lines 87-120 render five messages ending in "coming in next phase" instead of About, Skills, Projects, Experience, and Contact content. The planned `src/components/sections/` directory does not exist. `stats`, `skillCategories`, `projects`, and `experiences` are exported but unused, and `SectionHeading` is implemented but unused.

Impact:

- Navigation anchors resolve, but visitors receive no substantive portfolio evidence.
- The main value proposition, project proof, career history, and contact workflow are absent.
- The installed animation dependency and most content scaffolding add bundle/development overhead without current value.

### ISS-003: No Automated Tests or CI

`package.json` has only `dev`, `build`, `start`, and `lint` scripts. No test/spec files, test configuration, or `.github` workflow exists.

Impact:

- Theme hydration, menu behavior, anchor integrity, content rendering, and form behavior cannot be regression-tested.
- Lint and compilation cannot detect keyboard, interaction, responsive, or runtime regressions.
- Quality checks rely on a developer remembering to run them locally.

### ISS-004: Mobile Navigation Accessibility and State Handling

`src/components/layout/MobileNav.tsx` toggles a visual overlay but does not expose `aria-expanded` or `aria-controls`, assign an accessible name to the navigation region, close on Escape, move focus into the open menu, trap focus, or restore focus to the trigger. When closing, it writes `document.body.style.overflow = "unset"` instead of restoring the body's prior inline overflow value.

Impact:

- Screen-reader and keyboard users receive incomplete state and focus feedback.
- Keyboard focus can move behind the full-screen overlay.
- The component can overwrite scroll-lock state owned by another feature.

### ISS-005: Insufficient Light-Theme Accent Contrast

The light theme defines `--accent: #0ea5e9` on a white background. The measured contrast is 2.77:1. `text-accent` is used for the hero name, badges, hover/focus states, and navigation accents; white is also used over the accent in the monogram hover state.

Impact:

- The combination fails WCAG 2.1 AA's 4.5:1 requirement for normal text and is below the 3:1 threshold for large text and meaningful graphical states.
- Focus, hover, and branded text can be difficult to perceive in the light theme.

### ISS-006: Reduced Motion Is Not Respected

`src/app/globals.css` enables smooth scrolling and body color transitions globally. The hero status and `SectionHeading` use continuous `animate-pulse`, with more Motion-based animation planned. There is no `prefers-reduced-motion` override.

Impact:

- Users who request reduced motion still receive smooth scrolling, transitions, and continuous pulsing.
- Adding the planned entrance animations without a shared policy will amplify this accessibility gap.

### ISS-007: Network-Dependent Production Build

`src/app/layout.tsx` imports Geist and Geist Mono through `next/font/google`. A restricted-network build failed because it could not reach `fonts.googleapis.com`; the same commit built successfully when outbound access was allowed.

Impact:

- Cold builds fail in offline, restricted, or intermittently connected CI environments.
- Build reproducibility depends on an external service that is not declared as an operational prerequisite.

### ISS-008: Generic and Incomplete SEO Metadata

`src/app/layout.tsx` contains only a generic title and description. There is no `metadataBase`, canonical URL, title template, Open Graph metadata, X/Twitter card metadata, manifest, `robots.ts`, `sitemap.ts`, or social preview image. Metadata is not sourced from `siteConfig`.

Impact:

- Search results and shared links do not identify the actual portfolio owner.
- Crawlers lack explicit canonical, sitemap, and indexing guidance.
- Social previews are incomplete and inconsistent.

### ISS-009: Development Plans Are Ignored by Git

Line 43 of `.gitignore` ignores `development-plans/`. `git check-ignore` confirms that `MEMORY.md`, `ISSUES.md`, and `SOLUTIONS.md` are ignored along with the four existing plans.

Impact:

- Project decisions, roadmaps, scan findings, and remediation guidance are not preserved in normal commits.
- Other clones and collaborators cannot access the documented project state.
- The documented governance policy conflicts with repository persistence behavior.

### ISS-010: Documentation and Plan Drift

`README.md` is unchanged Create Next App boilerplate and tells contributors to edit `app/page.tsx` instead of `src/app/page.tsx`. `development-plan-01.md` still requests Framer Motion, `tailwind.config.ts`, and Prettier, while the project uses Motion, Tailwind v4 CSS-first configuration, and has no Prettier setup. Several completed Phase 1 and Phase 2 items remain unchecked in the master plan.

Impact:

- New contributors receive incorrect setup and architecture guidance.
- Multiple planning files disagree about the selected stack and progress.
- Stale instructions encourage unnecessary or conflicting configuration changes.

### ISS-011: Social-Link Ergonomics and Accessibility

Every social link, including `mailto:`, is rendered with `target="_blank"`. Footer links wrap a 16-pixel icon without padding or an explicit focus-visible style, leaving a small pointer/touch target. The custom SVGs do not explicitly inherit `aria-hidden` when their parent link already has an accessible label.

Impact:

- Email may open through an unnecessary blank browsing context.
- Footer targets are smaller than the commonly recommended 44-by-44-pixel touch area.
- Keyboard focus is less visible in the footer than on primary controls.

### ISS-012: Code and Dependency Hygiene

The social-icon selection switch is duplicated in `page.tsx` and `Footer.tsx`, and both accept a generic `string`, losing exhaustive checking from the `SocialLink` icon union. Default Create Next App SVG files are unused. `motion`, `SectionHeading`, and most content arrays are currently unused pending Phase 3. `npm ls --depth=0` also reports seven extraneous optional/WASM-related packages in the local `node_modules` tree, although it exits successfully and `npm audit` reports no vulnerabilities.

Impact:

- Duplicate mapping logic can drift as new social types are introduced.
- Unused files and dependencies obscure what the application actually needs today.
- A non-clean install can make local behavior differ from a fresh `npm ci` environment.

## Checks That Passed

- ESLint completed with zero reported errors or warnings.
- TypeScript strict compilation completed successfully.
- The production build completed successfully with network access.
- The npm registry audit reported zero known vulnerabilities.
- The repository had no tracked modifications at the start of the scan.
