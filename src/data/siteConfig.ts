import type {
  Experience,
  NavLink,
  Project,
  SkillCategory,
  SocialLink,
  StatItem,
} from "@/types";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "Faraz Hussain",
  shortName: "FH",
  title: "Full-Stack Engineer",
  tagline:
    "I turn complex product ideas into fast, accessible interfaces that feel inevitable.",
  bio: "My work sits at the intersection of product thinking, design systems, and rigorous full-stack engineering. Every interaction is intentional, every component earns its place, and quality is treated as a feature.",
  aboutParagraphs: [
    "I care about the part of software people actually experience: clarity of information, speed of the response, and confidence created by thoughtful interaction design.",
    "My approach combines typed React architecture, resilient component systems, accessible interaction patterns, and measured motion. The goal is not decoration. It is an interface that communicates quality before a user reads a single line of implementation detail.",
    "This portfolio is itself a living case study. It is built with server-first composition, focused client boundaries, semantic design tokens, keyboard-safe interactions, and a quality gate that covers linting, types, tests, and production output.",
  ],
  location: "Pakistan · Available worldwide",
  email: "farazhussain5000@gmail.com",
  status: "Available for ambitious projects",
  url: configuredUrl ?? "http://localhost:3000",
  keywords: [
    "Full-Stack Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Design Systems",
    "Web Accessibility",
  ],
};

export const stats: StatItem[] = [
  {
    value: "19",
    label: "React runtime",
    description: "Modern server and client composition",
  },
  {
    value: "Strict",
    label: "Type safety",
    description: "Compiler-verified component contracts",
  },
  {
    value: "AA",
    label: "Accessibility target",
    description: "Contrast, keyboard, and motion-aware UX",
  },
  {
    value: "4",
    label: "Release gates",
    description: "Lint, types, tests, and production build",
  },
];

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Approach", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const optionalSocialLinks: Array<SocialLink | undefined> = [
  process.env.NEXT_PUBLIC_GITHUB_URL
    ? {
        label: "GitHub",
        href: process.env.NEXT_PUBLIC_GITHUB_URL,
        icon: "github",
      }
    : undefined,
  process.env.NEXT_PUBLIC_LINKEDIN_URL
    ? {
        label: "LinkedIn",
        href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
        icon: "linkedin",
      }
    : undefined,
  process.env.NEXT_PUBLIC_X_URL
    ? {
        label: "X",
        href: process.env.NEXT_PUBLIC_X_URL,
        icon: "twitter",
      }
    : undefined,
];

export const socialLinks: SocialLink[] = [
  ...optionalSocialLinks.filter((link): link is SocialLink => Boolean(link)),
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    icon: "mail",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Interface Engineering",
    items: [
      { name: "React 19", level: "Expert" },
      { name: "Next.js App Router", level: "Expert" },
      { name: "TypeScript", level: "Expert" },
      { name: "Tailwind CSS v4", level: "Expert" },
      { name: "Responsive UI", level: "Expert" },
      { name: "Motion Systems", level: "Advanced" },
    ],
  },
  {
    category: "Product Craft",
    items: [
      { name: "Design Systems", level: "Expert" },
      { name: "Interaction Design", level: "Advanced" },
      { name: "Visual Hierarchy", level: "Advanced" },
      { name: "Accessibility", level: "Advanced" },
      { name: "Content Architecture", level: "Advanced" },
      { name: "Figma to Code", level: "Advanced" },
    ],
  },
  {
    category: "Architecture",
    items: [
      { name: "Server Components", level: "Advanced" },
      { name: "Component APIs", level: "Expert" },
      { name: "State Modeling", level: "Advanced" },
      { name: "REST APIs", level: "Advanced" },
      { name: "Progressive Enhancement", level: "Advanced" },
      { name: "Performance Strategy", level: "Advanced" },
    ],
  },
  {
    category: "Quality Systems",
    items: [
      { name: "Semantic HTML", level: "Expert" },
      { name: "ESLint", level: "Advanced" },
      { name: "Vitest", level: "Advanced" },
      { name: "Testing Library", level: "Advanced" },
      { name: "CI Quality Gates", level: "Advanced" },
      { name: "Git", level: "Expert" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "portfolio-experience-system",
    title: "Portfolio Experience System",
    description:
      "A recruiter-focused portfolio engineered as a product experience: distinctive visual direction, server-first rendering, accessible client interactions, resilient theming, and an automated quality gate.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Motion"],
    category: "Frontend",
    featured: true,
    demoUrl: "#home",
    githubUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL,
    highlights: [
      "Focused client boundaries preserve a fast server-rendered core",
      "Motion, contrast, focus, and navigation patterns account for accessibility",
      "Content, components, and design tokens are independently maintainable",
    ],
  },
  {
    id: "interaction-accessibility-layer",
    title: "Interaction & Accessibility Layer",
    description:
      "A cohesive interaction system covering keyboard-safe overlays, reduced-motion behavior, visible focus, large touch targets, theme persistence, and semantic status feedback.",
    tags: ["Accessibility", "React", "Motion", "CSS", "Testing Library"],
    category: "Frontend",
    featured: true,
    highlights: [
      "Focus-managed mobile navigation with escape and restoration behavior",
      "Shared reduced-motion policy across CSS and component animation",
      "Accessible token pairings verified for both color themes",
    ],
  },
  {
    id: "typed-content-architecture",
    title: "Typed Content Architecture",
    description:
      "A centralized content model that keeps interface composition clean while enforcing predictable project, skill, social, and experience records through strict TypeScript contracts.",
    tags: ["TypeScript", "Content Modeling", "Component APIs", "Vitest"],
    category: "Full Stack",
    featured: false,
    highlights: [
      "Single source of truth for public-facing portfolio content",
      "Environment-aware optional social and deployment configuration",
      "Automated validation for URLs, IDs, and placeholder values",
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "practice-product-thinking",
    role: "Start with the product signal",
    company: "01 · Product thinking",
    period: "Clarity before complexity",
    description: [
      "Define the audience, the decision they need to make, and the evidence the interface must provide.",
      "Shape content hierarchy and interaction flow before committing to decorative treatments.",
    ],
    technologies: ["Information Architecture", "UX Strategy", "Content Design"],
  },
  {
    id: "practice-system-design",
    role: "Build the interface as a system",
    company: "02 · Frontend architecture",
    period: "Composable by default",
    description: [
      "Create durable component contracts and semantic tokens instead of one-off page styling.",
      "Keep the server-rendered surface broad and introduce client state only where interaction requires it.",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Design Tokens"],
  },
  {
    id: "practice-verification",
    role: "Verify the experience, not just the build",
    company: "03 · Quality engineering",
    period: "Evidence over assumption",
    description: [
      "Test keyboard behavior, motion preferences, responsive layouts, content integrity, and failure states.",
      "Treat linting, strict types, component tests, and production compilation as a single release gate.",
    ],
    technologies: ["Accessibility", "Vitest", "Testing Library", "CI"],
  },
];
