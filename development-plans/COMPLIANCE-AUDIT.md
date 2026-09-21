# Web Application Compliance Audit and Remediation Report

- Audit date: 2026-09-21
- Remediation date: 2026-09-21
- Repository baseline: `pre-production` at
  `2013a90981f4db2e07b29299313e02f060a71272`
- Audit basis: `Web Application Compliance Audit Master Prompt.pdf`

This is a technical and operational compliance-readiness review, not legal advice, a
penetration test, a WCAG conformance certification, or a security certification.
Legal applicability and production account facts require owner and qualified-counsel
confirmation.

## 1. Executive Summary

The original audit identified 12 findings: 0 critical, 1 high, 5 medium, and 6 low.
Every finding received an in-repository remediation. The apparent high-severity public
access issue was also resolved by identifying the correct production origin:
`https://faraz-hussain-portfolio.vercel.app` returns HTTP 200 anonymously, while the
previously tested generated deployment URL is intentionally authenticated. A release
verifier, workflow, and exact operating procedure prevent these URL classes from being
confused during future launches.

Material improvements include:

- A public privacy notice, just-in-time form disclosure, explicit analytics preference,
  and default-off analytics loading.
- A published 12-month contact-retention ceiling, privacy-request route, pseudonymous
  ten-minute rate-limit keys, and an operational deletion runbook.
- WCAG-oriented border contrast, a skip link, coherent SVG semantics, forced-colors
  behavior, accessible new-tab names, axe-core regression testing, and cross-browser
  Playwright coverage.
- An enforced Content Security Policy and browser security headers, no framework
  disclosure header, request size/type validation, provider timeouts, and non-cacheable
  contact responses.
- Distributed production throttling that fails closed without configuration; local
  throttling is bounded and pruned.
- A safe email fallback that never places submitted personal content in a URL.
- Narrower public claims, a dated quality-evidence page, a proprietary root license,
  third-party notices, and asset provenance records.

Lint, strict TypeScript, 21 unit/component/accessibility tests, the production build,
and six locally available Playwright projects/tests pass. Chromium, WebKit, and mobile
Chromium passed locally. Firefox remains configured for the Linux CI matrix because
the downloaded Windows Playwright Firefox build failed before page creation in this
environment.

The production origin is anonymously reachable. Vercel Authentication remains enabled
with Standard Protection so generated deployment and preview URLs stay private. The
pending code must now be deployed to production and pass the content-aware release
verifier before this remediation phase is considered released.

## 2. Scope and Evidence

### Product scope

The repository implements a single-page software-engineering portfolio plus privacy
and quality-evidence pages. It contains:

- Hero, about, skills, projects, engineering approach, and contact sections.
- Responsive navigation, themes, motion, skill filtering, and accessible status
  feedback.
- A contact endpoint backed by Resend when production credentials exist.
- Optional, explicit-opt-in Vercel Web Analytics.
- Generated manifest, Open Graph image, robots, and sitemap routes.

No account, authentication, payment, subscription, checkout, upload, database,
advertisement, testimonial, rating, client-logo gallery, user-generated publishing, or
third-party media embed was found.

### Route inventory

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/` | Static | Portfolio experience and contact form |
| `/privacy` | Static | Privacy notice and analytics preference |
| `/quality` | Static | Dated engineering evidence and explicit limitations |
| `/api/contact` | Dynamic `POST` | Validated, throttled contact delivery |
| `/manifest.webmanifest` | Generated static | Install metadata |
| `/opengraph-image` | Generated static | Original social preview |
| `/robots.txt` | Generated static | Crawler rules |
| `/sitemap.xml` | Generated static | Public route discovery |
| `/_not-found` | Static | Framework not-found response |

### Data-flow inventory

| Data | Purpose and flow | Storage and protection |
| --- | --- | --- |
| Name, email, subject, message | Browser to `/api/contact`, Resend, and the configured mailbox | No application database; routine enquiries carry a published 12-month maximum and operational deletion procedure |
| Honeypot `website` field | Reject automated submissions without disclosing detection | Transient; checked before rate limiting |
| Request address | Abuse prevention only | HMAC-pseudonymized before local/Upstash storage; ten-minute TTL; raw address is not used as the key |
| Analytics metadata | Aggregate traffic measurement through Vercel | No analytics script or event before explicit opt-in; withdrawal blocks subsequent events |
| Theme and analytics choices | Functional browser preferences | Browser-only until changed or site storage is cleared |

### Forms and consent

The contact form uses named labels, native constraints, API validation, output escaping,
non-cacheable responses, provider timeouts, a hidden honeypot, and status/alert live
regions. Its just-in-time notice identifies Resend and the mailbox and links to the
privacy notice.

The form is not mislabeled as consent. Contact processing is tied to the visitor's
request and applicable legitimate interests, subject to jurisdictional review.
Analytics is disabled by default, uses a specific enable/disable control, and can be
withdrawn through the same control.

### Trackers and third parties

| Provider/technology | Role | Current control |
| --- | --- | --- |
| Vercel | Hosting and optional Web Analytics | Analytics loads only after opt-in; event middleware rechecks the stored choice |
| Resend | Contact email processor | Contact request only; public disclosure, timeout, and retention runbook added |
| Upstash Redis | Production distributed throttling | Required for production delivery; only pseudonymous expiring counters are stored |
| `next-themes` | Functional theme preference | Disclosed as browser storage; no analytics purpose |
| GitHub, LinkedIn, X | Optional outbound links | No request until visitor activation; maintained attributed icons |

No advertising pixel, tag manager, session replay, behavioral profiling, or error
tracker was found.

### Asset and licensing evidence

- `ASSET-PROVENANCE.md` records the owner-supplied signature, generated artwork, icon
  sources, transformations, and trademark posture.
- `THIRD_PARTY_NOTICES.md` records direct runtime dependency licenses.
- `LICENSE` states the owner's all-rights-reserved repository policy without claiming
  rights over third-party material.
- GitHub, LinkedIn, and X symbols now come from the MIT-licensed React Icons package;
  general interface icons remain attributable to Lucide.

### Authoritative references

Sources were accessed on 2026-09-21:

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/), including
  [bypass blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks),
  [focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order), and
  [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).
- [OWASP Application Security Verification Standard](https://owasp.org/projects/asvs/).
- [Next.js response-header configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers).
- [Vercel Web Analytics privacy documentation](https://vercel.com/docs/analytics/privacy-policy)
  and [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection).
- [Resend Data Processing Addendum](https://resend.com/legal/dpa) and
  [Resend subprocessors](https://resend.com/legal/subprocessors).
- [Upstash rate-limit documentation](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview).
- [EU General Data Protection Regulation](https://eur-lex.europa.eu/eli/reg/2016/679).
- [California Privacy Protection Agency FAQ](https://cppa.ca.gov/faq).
- [Pakistan Ministry of IT and Telecommunication legislation page](https://www.moitt.gov.pk/Legislations)
  and [Pakistan Senate bill summary](https://www.senate.gov.pk/en/billsummary.php?bid=1182).

The reviewed official Pakistan sources did not support a sufficiently certain current
enactment conclusion for a comprehensive personal-data statute. That question remains
for qualified local counsel.

## 3. Applicability Matrix

Only the mandated status vocabulary is used.

| # | Requirement | Post-remediation evidence | Status |
| --- | --- | --- | --- |
| 1 | Privacy Policy | `/privacy` covers data, purposes, providers, transfers, retention, requests, children, and changes. | Compliant |
| 2 | Terms and Conditions | No account, transaction, user content, or paid service exists. | Not applicable |
| 3 | Cookie or Similar Technology Policy | Privacy notice explains optional analytics and browser preferences. | Compliant |
| 4 | Cookie Consent Controls | Analytics is default-off, purpose-specific, reversible, and event-filtered after withdrawal. | Compliant |
| 5 | Refund, Return, Cancellation, Renewal | No payment, booking, subscription, or renewal exists. | Not applicable |
| 6 | Form Notice and Consent | Just-in-time disclosure links to the full notice and identifies the delivery flow. | Compliant |
| 7 | Data Minimization, Retention, Deletion | Limited fields, length/body caps, 12-month ceiling, ten-minute pseudonymous limiter TTL, and deletion runbook exist. Provider/mailbox execution requires ongoing owner operation. | Partially compliant |
| 8 | Analytics, Telemetry, Advertising, Error Tracking | Optional Vercel Analytics cannot load before opt-in; no ads, replay, or error tracker exists. | Compliant |
| 9 | Third-party Embeds and External Resources | No embeds or remote fonts; providers activate only for the requested function. | Compliant |
| 10 | WCAG Accessibility | Original issues are fixed and automated/manual regression evidence expanded; complete conformance still requires assistive-technology review. | Partially compliant |
| 11 | Image Alternatives and Non-text Content | Decorative icons are hidden, parent controls are named, and logo semantics are no longer contradictory. | Compliant |
| 12 | Color Contrast and Non-color Cues | Automated tests enforce AA text and 3:1 control-boundary token contrast in both themes. | Compliant |
| 13 | Keyboard, Focus, and Form Accessibility | Skip link, logical focus, focus-visible treatment, modal focus management, labels, and status semantics are covered. | Compliant |
| 14 | Clear Labels, Links, Buttons, and CTAs | Controls are named and external-context changes are announced. | Compliant |
| 15 | Reviews, Testimonials, Ratings, Logos, Trust Claims | No such claim or asset exists. | Not applicable |
| 16 | Unsupported, Misleading, or High-risk Claims | Broad claims were narrowed and `/quality` exposes dated evidence and limitations. | Compliant |
| 17 | Business Identity, Contact, and Disclosures | Identity and contact are clear, and the confirmed production origin is anonymously reachable while non-production URLs remain protected. | Compliant |
| 18 | Copyright, Trademark, Licensing, Provenance | Root license, notices, attributed icon source, and asset provenance are present. | Compliant |
| 19 | Applicable Laws, Regulations, Standards | Technical safeguards are implemented; jurisdiction/entity facts and authoritative legal interpretation remain unavailable. | Unable to verify |
| 20 | Additional Material Risks | CSP/security headers, production distributed throttling, bounded local fallback, body controls, escaping, and timeouts are present. | Compliant |
| 21 | Accuracy, Evidence, Error Prevention | Copy was reconciled, quality evidence published, tests expanded, and limitations made explicit. | Compliant |

## 4. Changes Made

- Added `/privacy`, analytics choice controls, default-off loading, and withdrawal-time
  event filtering.
- Added form disclosure and replaced automatic prefilled `mailto:` navigation with an
  explicit blank-draft option.
- Added HMAC-pseudonymous distributed rate limiting through Upstash REST, a bounded
  local test/development fallback, request type/size limits, provider timeouts,
  non-cacheable responses, and expanded route tests.
- Added a global skip link, stronger border tokens, forced-colors handling, coherent
  signature semantics, and new-context accessible names.
- Added CSP, HSTS, permissions/referrer/MIME/frame/cross-origin headers and disabled
  `X-Powered-By`.
- Added `/quality`, narrowed unsupported wording, and reconciled full-stack positioning.
- Added `LICENSE`, `ASSET-PROVENANCE.md`, and `THIRD_PARTY_NOTICES.md` and replaced
  unattributed custom brand paths with maintained React Icons components.
- Added axe-core tests, automated contrast/security tests, expanded contact/privacy
  tests, Playwright Chromium/WebKit/mobile/CI-Firefox coverage, and CI browser gates.
- Added a public-release verifier, manual GitHub workflow, stable sitemap timestamps,
  and `COMPLIANCE-OPERATIONS.md`.

## 5. Items Requiring Owner/Legal/Security/Business Input

- Preserve Vercel Authentication with Standard Protection and keep
  `faraz-hussain-portfolio.vercel.app` as the sole intended public production domain.
- Keep `NEXT_PUBLIC_SITE_URL` set to
  `https://faraz-hussain-portfolio.vercel.app`.
- Configure Resend, Upstash, and a unique 32-or-more-character rate-limit salt. The
  production contact endpoint intentionally returns `503` until every required value
  exists.
- Operationally enforce the published 12-month mailbox/Resend retention commitment and
  privacy-request procedure.
- Confirm controller/entity details, target markets, contracts, international-transfer
  posture, and applicable law with qualified counsel.
- Confirm the all-rights-reserved repository policy and owner-supplied signature record
  match the owner's intent.
- Complete a human screen-reader and browser zoom review before claiming WCAG
  conformance; the site currently claims only a target and evidence, not certification.

## 6. Remaining Risks and Deferred Work

### RISK-001: Production promotion and content verification remain pending

- Severity: Medium
- Confidence: High
- Status: Public access verified; new release not yet deployed
- Evidence: The confirmed production origin returns HTTP 200 anonymously, but its
  current deployment predates the new `main-content` release marker.
- Required closure: Deploy this remediation commit to production and obtain a
  successful content-aware verifier result at the confirmed production origin.

### RISK-002: Operational privacy promises require execution

- Severity: Medium
- Confidence: High
- Status: Policy and runbook implemented; account operations unable to verify
- Evidence: Code cannot inspect or delete the owner's mailbox, Resend history, Vercel
  dashboard, or contracts.
- Required closure: Follow the monthly retention review and retain private completion
  evidence without copying visitor content into the repository.

### RISK-003: Legal applicability remains fact-dependent

- Severity: Potentially high
- Confidence: High that facts are missing; no legal conclusion made
- Status: Unable to verify
- Evidence: Entity status, revenue, audience targeting, contracts, and authoritative
  local interpretation were not supplied.
- Required closure: Obtain qualified advice for the actual launch markets and update
  the public notice if the determined obligations differ.

### RISK-004: Static-compatible CSP retains inline allowances

- Severity: Low
- Confidence: High
- Status: Materially reduced, not eliminated
- Evidence: The enforced CSP restricts origin, object, frame, form, media, and browser
  capabilities but permits inline scripts/styles required by the current Next.js/theme
  implementation.
- Required closure: Reassess nonce/hash-based CSP if the application moves to dynamic
  rendering or the framework provides a compatible strict static approach.

### RISK-005: Complete accessibility certification remains out of scope

- Severity: Low
- Confidence: High
- Status: Regression coverage implemented; certification not claimed
- Evidence: axe-core, keyboard, accessibility-tree, contrast, reflow, reduced-motion,
  forced-colors CSS, Chromium, WebKit, and mobile checks exist. A human screen-reader
  and full zoom/cognitive review remains necessary.
- Required closure: Perform the manual quarterly checklist in
  `COMPLIANCE-OPERATIONS.md` and remediate any observed defect.

### RISK-006: Local Windows Firefox runner failure

- Severity: Low
- Confidence: High for this machine
- Status: CI coverage configured; local engine unable to verify
- Evidence: Playwright Firefox 155 failed inside `browserContext.newPage` before the
  application loaded, while Chromium and WebKit passed. Firefox remains in the Linux
  GitHub Actions matrix.
- Required closure: Confirm the next CI run passes Firefox or investigate the runner
  environment if it does not.

## 7. Verification Results

| Check | Result | Evidence/limit |
| --- | --- | --- |
| ESLint | Passed | Exit 0 |
| Strict TypeScript | Passed | Exit 0 |
| Vitest | Passed | 9 files, 21 tests |
| axe-core semantic rules | Passed | Included in Vitest; color contrast is tested separately because jsdom has no layout engine |
| Light/dark token contrast | Passed | Text thresholds at least 4.5:1; border/background and border/card thresholds at least 3:1 |
| Production build | Passed | Next.js generated 10 route entries, including `/privacy` and `/quality` |
| Runtime pages | Passed | `/`, `/privacy`, and `/quality` returned 200 |
| Security headers | Passed | CSP, HSTS, MIME, frame, referrer, permissions, and cross-origin headers emitted; no `X-Powered-By` |
| Initial analytics state | Passed | Initial HTML contained no Vercel Analytics script; Playwright observed no request before opt-in |
| Analytics preference | Passed | Enable/disable state persisted and event filter rejected pre-consent/post-withdrawal events |
| Contact validation | Passed | Type, syntax, body size, field, honeypot, escape, provider-failure, no-store, and `429` paths tested |
| Local contact runtime | Passed | Invalid 400, honeypot 200, and unconfigured valid 503 were non-cacheable |
| Playwright Chromium | Passed | Keyboard skip, focus target, reflow, and analytics tests |
| Playwright WebKit | Passed | Focus activation, reflow, and analytics tests |
| Playwright mobile Chromium | Passed | Mobile menu, focus restoration, reflow, and analytics tests |
| Playwright Firefox on Windows | Unable to verify | Runner failed before page creation; Linux CI project remains configured |
| Anonymous production origin | Passed for access | `faraz-hussain-portfolio.vercel.app` returned HTTP 200 without authentication; release marker awaits deployment |
| Live Resend/Upstash delivery | Unable to verify | Production credentials were neither available nor used |
| Full WCAG conformance | Unable to verify | Certification and complete assistive-technology review remain out of scope |
| Legal compliance | Unable to verify | Business facts and legal interpretation remain owner/counsel responsibilities |

## 8. Change Summary

All 12 original findings received concrete remediation. The repository now defaults to
privacy-preserving behavior, publishes its practices and limits, enforces browser and
contact protections, records asset rights, and tests the major accessibility and
cross-browser paths. The intended production domain is publicly reachable; final
closure requires deploying this release and passing the content-aware verifier. No
claim of legal, security, or WCAG certification is made.
