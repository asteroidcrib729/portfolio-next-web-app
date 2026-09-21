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
    "I turn complex product ideas into responsive, accessible products that feel inevitable.",
  bio: "My work sits at the intersection of product thinking, design systems, and rigorous full-stack engineering. Every interaction is intentional, every component earns its place, and quality is treated as a feature.",
  aboutParagraphs: [
    "I care about the part of software people actually experience: clarity of information, speed of the response, and confidence created by thoughtful interaction design.",
    "My approach connects typed React and Next.js interfaces with Node.js and Python services, REST APIs, and SQL and NoSQL data systems. Accessibility, maintainability, and measured performance guide the work from browser to backend.",
    "This portfolio is itself a living case study. It is built with focused client boundaries, semantic design tokens, keyboard-safe interactions, and a quality gate that covers linting, types, tests, and production output.",
  ],
  location: "Pakistan · Available worldwide",
  email: "farazhussain5000@gmail.com",
  status: "Available for ambitious projects",
  url: configuredUrl ?? "http://localhost:3000",
  keywords: [
    "Software Engineer",
    "Full-Stack Engineer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Node.js",
    "Python",
    "Django",
    "REST APIs",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Azure",
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
  { label: "About", href: "/#about" },
  { label: "Expertise", href: "/#skills" },
  { label: "Work", href: "/#projects" },
  { label: "Approach", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
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
    category: "Programming Languages",
    items: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Python" },
      { name: "C#" },
      { name: "Java" },
    ],
  },
  {
    category: "Frontend Engineering",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "HTML & CSS" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js" },
      { name: "Django" },
      { name: "Flask" },
      { name: "FastAPI" },
      { name: "REST APIs" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Microsoft SQL Server" },
      { name: "SQLite" },
      { name: "MongoDB" },
    ],
  },
  {
    category: "Cloud & Developer Tools",
    items: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "AWS" },
      { name: "Azure" },
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
      "Focused client boundaries preserve the server-rendered core",
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
      "AA text and control-boundary contrast covered by automated token tests",
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
    role: "Build the product as a system",
    company: "02 · Full-stack architecture",
    period: "Composable by default",
    description: [
      "Create durable component and service contracts instead of one-off implementation paths.",
      "Keep server and client boundaries explicit, and introduce state only where the product requires it.",
    ],
    technologies: ["React", "Next.js", "TypeScript", "API Design"],
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
