# Development Plan 02: Core Setup, Theme Integration, and Base Shell

## 1. Current State & Environment Assessment

The Next.js base project has been initialized with the following technical baseline:

- **Next.js:** 16.3.4 (App Router)
- **React & React DOM:** 19.2.8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss: ^4`)
- **Compiler:** React Compiler enabled via `babel-plugin-react-compiler` (`reactCompiler: true` in `next.config.ts`)
- **TypeScript:** Strict mode enabled (`tsconfig.json`)

---

## 2. Immediate Next Steps Overview

With project initialization complete, the immediate focus shifts to establishing the foundational UI toolkit, theming infrastructure, and application shell.

### High-Level Milestones

1. **Dependency Installation:** Add essential UI, styling, and icon utilities compatible with React 19.
2. **Boilerplate Cleanup:** Strip default template code from `src/app/page.tsx` and prepare layout placeholders.
3. **Dark / Light Theme System:** Configure `next-themes` and Tailwind v4 theme variables for smooth theme switching without flash of unstyled content (FOUC).
4. **Data Architecture Blueprint:** Set up typed data schemas in `src/data/` for profile details, skills, projects, and work history.
5. **Core Shell & Navigation:** Build the responsive `Navbar`, `MobileNav`, `Footer`, and `ThemeToggle` components.

---

## 3. Dependencies & Tooling

To ensure stability with Next.js 16 and React 19, the following packages are designated for installation:

| Package                   | Purpose                                       | Version / Compatibility                             |
| :------------------------ | :-------------------------------------------- | :-------------------------------------------------- |
| `lucide-react`            | Modern, lightweight icons                     | Latest (React 19 compatible)                        |
| `clsx` + `tailwind-merge` | Conditional class composition (`cn()` helper) | Standard utility                                    |
| `next-themes`             | System, light, and dark mode provider         | Compatible with App Router                          |
| `motion`                  | Fluid animations & micro-interactions         | Motion v12+ (modern replacement for`framer-motion`) |

---

## 4. Proposed File Additions for This Phase

```text
src/
├── app/
│   ├── layout.tsx         # Updated with ThemeProvider & font variables
│   ├── page.tsx           # Cleaned up root page shell
│   └── globals.css        # Custom theme variables & utilities
├── components/
│   ├── common/
│   │   ├── Container.tsx   # Max-width wrapper component
│   │   └── ThemeToggle.tsx # Light/dark mode toggle button
│   ├── layout/
│   │   ├── Navbar.tsx      # Desktop & sticky navigation bar
│   │   ├── MobileNav.tsx   # Mobile drawer navigation
│   │   └── Footer.tsx      # Site footer
│   └── providers/
│       └── ThemeProvider.tsx # Client-side theme provider wrapper
├── data/
│   ├── siteConfig.ts      # Social links, site title, metadata
│   ├── skills.ts          # Tech stack categorized
│   └── projects.ts        # Project details, demo links, tags
├── lib/
│   └── utils.ts           # Class merging helper function (cn)
└── types/
    └── index.ts           # Shared TypeScript interfaces
```

---

## 5. Phased Execution Checklist

### Step 2.1: Package Installation & Class Helper

- [x] Install `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`, and `motion`.
- [x] Create `src/lib/utils.ts` with `cn()` helper function.

### Step 2.2: Theme Provider & Global Styling

- [x] Create `src/components/providers/ThemeProvider.tsx` using `next-themes`.
- [x] Configure `src/app/layout.tsx` to wrap `children` in `ThemeProvider` with `attribute="class"`.
- [x] Update `src/app/globals.css` with smooth transitions and theme color variables.

### Step 2.3: Data Structure Scaffolding

- [x] Create `src/types/index.ts` defining `Project`, `Skill`, `Experience`, and `SocialLink`.
- [x] Create `src/data/siteConfig.ts` with personal metadata, bio, and navigation links.

### Step 2.4: Layout Shell Implementation

- [x] Create `src/components/common/Container.tsx` for consistent horizontal padding and max-widths.
- [x] Create `src/components/common/ThemeToggle.tsx` with sun/moon icon toggle.
- [x] Create `src/components/layout/Navbar.tsx` and `src/components/layout/Footer.tsx`.
- [x] Render the shell in `src/app/page.tsx` and verify clean build with zero hydration errors.

---

## 6. Verification Plan

- [x] **Lint Check:** Run `npm run lint` to verify zero ESLint errors.
- [x] **Build Check:** Run `npm run build` to ensure clean TypeScript compilation with React Compiler.
- [ ] **Development Server:** Run `npm run dev` to verify dark/light mode switching and responsive layout.
