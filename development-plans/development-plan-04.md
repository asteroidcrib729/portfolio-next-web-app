# Development Plan 04: Core Page Sections & Content Architecture (Phase 3)

## 1. Executive Summary & Objectives

This document specifies the technical architecture, component breakdown, data schemas, and phased execution checklist for **Phase 3: Core Page Sections & Content Architecture**.

With Phase 1 (Project Setup) and Phase 2 (Design Tokens, Theme Provider, and Layout Shell) completed, the goal of Phase 3 is to replace the placeholder anchors in `src/app/page.tsx` with high-craft, production-ready section components.

### Key Objectives

- **Modular Section Architecture:** Deconstruct the single-page layout into focused, reusable components under `src/components/sections/`.
- **Reusable Primitives:** Standardize section headers, eyebrow badges, and action triggers via `src/components/common/SectionHeading.tsx`.
- **Incorporate Design Research:** Integrate the "Modern Craft Hybrid" principles established in `development-plan-03.md` (Brittany Chiang editorial scannability + Paco Coursey micro-craft + Adham Dannaway role clarity).
- **Data-Driven Architecture:** Expand `src/data/siteConfig.ts` with comprehensive sample and production data for projects, career experience, and skills.
- **Micro-Interactions & Transitions:** Leverage `motion` for staggered entrance animations and hover states while preserving React 19 and React Compiler compatibility.

---

## 2. Component Hierarchy & Directory Layout

```text
src/
├── components/
│   ├── common/
│   │   ├── Container.tsx         # [Existing] Max-width wrapper
│   │   ├── Icons.tsx             # [Existing] Scalable SVG brand icons
│   │   ├── ThemeToggle.tsx       # [Existing] Hydration-safe theme switcher
│   │   └── SectionHeading.tsx    # [New] Reusable section title, eyebrow, and subtitle
│   ├── layout/
│   │   ├── Navbar.tsx            # [Existing] Glassmorphic sticky navigation
│   │   ├── MobileNav.tsx         # [Existing] Slide-out mobile drawer
│   │   └── Footer.tsx            # [Existing] Site footer with dynamic year
│   └── sections/
│       ├── Hero.tsx              # [New] Animated hero with status pill & dual CTA
│       ├── About.tsx             # [New] Narrative bio & stats/metrics grid
│       ├── Skills.tsx            # [New] Categorized skill badges with category filter
│       ├── Projects.tsx          # [New] Showcase cards with tags, links & hover states
│       ├── Experience.tsx        # [New] Chronological vertical timeline
│       └── Contact.tsx           # [New] Interactive contact form & direct channels
├── data/
│   └── siteConfig.ts             # [Updated] Comprehensive portfolio content
└── app/
    └── page.tsx                  # [Updated] Clean orchestration of section components
```

---

## 3. Section Specifications & Features

### 3.1 Common Primitive: `SectionHeading.tsx`

- **Purpose:** Enforces consistent typography, rhythm, and layout across all sections.
- **Props:**
  - `eyebrow?: string`: Small uppercase label (e.g., "FEATURED WORK", "CAREER PATH").
  - `title: string`: Main section heading (e.g., "Projects & Case Studies").
  - `description?: string`: Contextual subtitle explaining the section's focus.
  - `align?: 'left' | 'center'`: Configurable alignment (defaults to `'center'`).

### 3.2 Section 1: Hero (`Hero.tsx`)

- **Role Clarification:** Clear headline stating Full-Stack Engineer / Frontend Craft.
- **Status Indicator:** Glowing availability badge ("Available for new opportunities").
- **Call-to-Action Pair:** Primary button ("View Projects" linking to `#projects`) + Secondary button ("Get in Touch" linking to `#contact`).
- **Quick Links:** Social icons (GitHub, LinkedIn, X, Email).
- **Interactive Visual:** Code card preview or subtle interactive element highlighting engineering craft.
- **Animation:** Staggered fade-and-slide entry using `motion`.

### 3.3 Section 2: About Me (`About.tsx`)

- **Anchor ID:** `#about`
- **Narrative Content:** 2–3 structured paragraphs detailing background, engineering philosophy, and passion for performance and UX.
- **Highlight Metric Grid:** 4 key stat cards:
  - Years of Experience
  - Completed Projects
  - Modern Tech Stack Competencies
  - Code Quality & Performance Dedication
- **Visual Element:** Stylized decorative card with code snippet or profile focus.

### 3.4 Section 3: Skills & Tech Stack (`Skills.tsx`)

- **Anchor ID:** `#skills`
- **Category Filter Pills:** All, Frontend, Backend, Tools & DevOps, Core Strengths.
- **Skill Badges:** Interactive chip cards displaying skill name, proficiency/focus, and hover elevation.
- **Responsive Layout:** Grid dynamically adjusting from 2 columns (mobile) to 4 columns (desktop).

### 3.5 Section 4: Projects Showcase (`Projects.tsx`)

- **Anchor ID:** `#projects`
- **Card Design:** Inspired by Brittany Chiang & Paco Coursey:
  - Clean card surface with subtle border transition on hover (`border-accent/40`).
  - Project title with diagonal external link icon (`↗`).
  - Problem statement & core solution narrative.
  - Tech stack tag pills (`Next.js`, `TypeScript`, `Tailwind CSS`, etc.).
  - Action links: Live Demo, GitHub Repository.
- **Featured Flag:** Visual distinction for flagship projects.

### 3.6 Section 5: Work Experience & Education (`Experience.tsx`)

- **Anchor ID:** `#experience`
- **Timeline Structure:** Vertical timeline with continuous connecting line and indicator nodes.
- **Entry Details:**
  - Role title and company name with link.
  - Employment dates and location (e.g., "2024 — Present | Remote").
  - Bulleted achievements highlighting quantified engineering impact.
  - Technology tags associated with each role.

### 3.7 Section 6: Contact & Connect (`Contact.tsx`)

- **Anchor ID:** `#contact`
- **Direct Reach:** Direct email card with quick "Copy Email" button, location, and social links.
- **Interactive Form:**
  - Fields: Full Name, Email Address, Subject, Message.
  - Client-side validation with real-time feedback.
  - Submit state handling (loading indicator and success confirmation message).

---

## 4. Data Scaffolding Enhancements (`src/data/siteConfig.ts`)

Expand existing datasets to ensure complete, rich content:

- `experience`: Populate at least 3 detailed professional milestones with roles, companies, dates, and bullet accomplishments.
- `projects`: Expand project entries with rich descriptions, key highlights, GitHub links, and live URLs.
- `skills`: Ensure balanced distribution across Frontend, Backend, Tools & DevOps, and Architecture.
- `stats`: Define metric items for the About section.

---

## 5. Phased Implementation Checklist

### Step 3.1: Data Schema & Content Scaffolding

- [x] Verify and update `src/types/index.ts` for any new properties (stats, project highlights).
- [x] Enrich `src/data/siteConfig.ts` with comprehensive project, experience, and skill records.

### Step 3.2: Reusable UI Primitive

- [x] Create `src/components/common/SectionHeading.tsx`.
- [x] Ensure dark/light mode token compatibility and responsive typography.

### Step 3.3: Hero & About Sections

- [x] Implement `src/components/sections/Hero.tsx` with reduced-motion-aware entry.
- [x] Implement `src/components/sections/About.tsx` with bio narrative and metric cards.

### Step 3.4: Skills & Projects Sections

- [x] Implement `src/components/sections/Skills.tsx` with interactive category filtering.
- [x] Implement `src/components/sections/Projects.tsx` with case-study cards, hover elevation, and conditional external links.

### Step 3.5: Experience & Contact Sections

- [x] Implement `src/components/sections/Experience.tsx` with vertical timeline markers.
- [x] Implement `src/components/sections/Contact.tsx` with interactive form and direct contact channels.

### Step 3.6: Page Assembly & Verification

- [x] Refactor `src/app/page.tsx` to assemble all section components inside clean section wrappers.
- [x] Verify stable anchor targets and sticky-header scroll offsets for desktop and mobile navigation.
- [x] Run lint, TypeScript, tests, and the production build with clean results.

---

## 6. Verification & Quality Gates

- **Lint Check:** Clean exit (code 0) via `npm run lint`.
- **Build Check:** Clean production compilation (code 0) via `npm run build`.
- **Accessibility & Contrast:** High-contrast text tokens across both light and dark modes.
- **Hydration Safety:** Zero React hydration mismatch warnings.
- **Markdown Standards:** Strict adherence to MD022, MD032, and MD012.
