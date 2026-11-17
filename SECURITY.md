# Security Policy

This security policy applies to the `asteroidcrib729/portfolio-next-web-app` repository, its application source code and workflows, and the live portfolio deployment at `https://faraz-hussain-portfolio.vercel.app`.

## Supported Versions

This portfolio follows a single continuous release line rather than versioned software releases:

| Branch / Target                                           | Status      | Scope                                                                           |
| --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `main` (`https://faraz-hussain-portfolio.vercel.app`)     | Supported   | Active production deployment receiving security fixes and dependency updates    |
| `pre-production`                                          | Supported   | Staging and verification branch used to validate fixes before merging to `main` |
| Historical commits, archived branches, and external forks | Unsupported | Not actively maintained                                                         |

## Reporting a Vulnerability

Please do not open public GitHub issues, pull requests, or discussions for suspected security vulnerabilities.

### Preferred Channel: GitHub Private Vulnerability Reporting

Private vulnerability reporting is enabled on this repository. Submit a private report directly through GitHub:

- Open a private advisory at `https://github.com/asteroidcrib729/portfolio-next-web-app/security/advisories/new` (in GitHub, select the **Security** tab, **Advisories**, and **Report a vulnerability**).

### Alternative Channel: Direct Email

If you are unable to use GitHub Private Vulnerability Reporting, email `farazhussain5000@gmail.com` with the subject `Security vulnerability report`.

### What to Include

To help reproduce and assess the issue quickly, include:

- The affected route, component, dependency, or workflow file.
- Step-by-step reproduction instructions or a minimal proof of concept.
- The expected security impact, including any relevant request/response examples without third-party personal data or real credentials.

## Scope and Exclusions

### In Scope

- Application and API routes under `src/` (including `/api/contact` and authentication/session handling for `/studio`).
- Database, validation, and security header configuration (such as CSP, frame protections, and cookie attributes in `next.config.ts`).
- Dependency vulnerabilities or exposed secrets in committed source, build output, or `.github/workflows/`.

### Out of Scope and Expected Behavior

- Vercel Authentication prompts or access restrictions on generated preview and deployment URLs (intentional under Vercel Standard Protection; `https://faraz-hussain-portfolio.vercel.app` is the sole intended anonymous public production domain).
- Intentional protective behavior such as `/studio` redirecting unauthenticated users to `/studio/login`, HTTP `429` rate limiting on `/api/contact`, or fail-closed unavailability when local server credentials are unset.
- Volumetric denial-of-service testing, automated scanner noise without a reproducible exploit or security impact, contact-form spam, or brute-force attempts against `/studio/login`.
- Known documented baseline trade-offs already noted in `README.md` or `next.config.ts` (such as inline script/style allowances required by the Next.js and theme bootstrap) unless paired with a concrete exploit.
- Non-security bugs or privacy access/deletion requests (see `https://faraz-hussain-portfolio.vercel.app/privacy` for privacy requests).

## Response and Disclosure Expectations

- This repository is maintained individually and does not offer a paid bug bounty program.
- Reports are reviewed on a best-effort basis, acknowledged as soon as practical, prioritized by severity and real impact, and tested through `pre-production` quality and security gates before release to `main`.
- Please act in good faith during research: prefer a local clone with disposable test credentials over testing against live production data or third-party email/database providers, do not access or modify data that does not belong to you, and allow reasonable time for remediation before public disclosure.

## Automated Repository Security Controls

This repository maintains defense-in-depth automation across GitHub Actions and repository security settings:

- Native GitHub Dependabot vulnerability alerts, Dependabot security updates targeting `main`, and weekly dependency/action update checks targeting `pre-production` (`.github/dependabot.yml`).
- Native GitHub secret scanning and push protection, alongside Gitleaks history/source checks in CI.
- Automated `Dependency Security`, `CodeQL`, `Secret Scanning`, `Workflow Validation`, `Quality Gate`, and `Public Release Verification` workflows under `.github/workflows/`.
- Enforced Content Security Policy and browser security headers in `next.config.ts`, plus the operational procedures in `development-plans/COMPLIANCE-OPERATIONS.md`.
