import {
  NavLink,
  SocialLink,
  Project,
  SkillCategory,
  Experience,
  StatItem,
} from "@/types";

export const siteConfig = {
  name: "Alex Morgan",
  title: "Full Stack Engineer & Creative Developer",
  tagline: "Building resilient web applications, elegant interfaces, and modern digital experiences.",
  bio: "I am a software engineer focused on building fast, accessible, and delight-driven web experiences. I specialize in Next.js, TypeScript, React architecture, and performant backend APIs.",
  aboutParagraphs: [
    "I am a full-stack engineer with over 5 years of experience architecting reliable web systems and crafting polished, accessible user interfaces. I bridge the gap between rigorous systems thinking and refined visual craft.",
    "My engineering philosophy centers around performance, resilience, and user delight. Whether designing distributed edge APIs or micro-tuning 60fps spring transitions, I care deeply about the details that transform functional software into unforgettable experiences.",
    "When I'm not writing code, you can find me exploring open-source tools, experimenting with creative coding and generative shaders, or mentoring upcoming software developers.",
  ],
  location: "San Francisco, CA",
  email: "alex.morgan.dev@example.com",
  status: "Available for new opportunities",
};

export const stats: StatItem[] = [
  { value: "5+", label: "Years Experience", description: "Building scalable web products" },
  { value: "24+", label: "Projects Shipped", description: "From MVP to production enterprise apps" },
  { value: "99.9%", label: "System Reliability", description: "Commitment to fault-tolerant code" },
  { value: "15+", label: "Core Technologies", description: "Full-stack proficiency & modern tooling" },
];

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "Email", href: "mailto:alex.morgan.dev@example.com", icon: "mail" },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "React 19", level: "Expert" },
      { name: "Next.js (App Router)", level: "Expert" },
      { name: "TypeScript", level: "Expert" },
      { name: "Tailwind CSS v4", level: "Expert" },
      { name: "HTML5 / Semantic Web", level: "Expert" },
      { name: "Motion Animations", level: "Advanced" },
      { name: "Web Accessibility (a11y)", level: "Advanced" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js / Bun", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "REST & GraphQL APIs", level: "Expert" },
      { name: "Prisma & Drizzle ORM", level: "Advanced" },
      { name: "Redis Caching", level: "Intermediate" },
      { name: "Serverless & Edge Functions", level: "Advanced" },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "Docker & Containers", level: "Advanced" },
      { name: "AWS (S3, CloudFront, Lambda)", level: "Intermediate" },
      { name: "Vercel Edge Platform", level: "Expert" },
      { name: "CI/CD (GitHub Actions)", level: "Advanced" },
      { name: "Linux / Shell Scripting", level: "Intermediate" },
    ],
  },
  {
    category: "Tools & Testing",
    items: [
      { name: "Git & Version Control", level: "Expert" },
      { name: "Vitest & Jest", level: "Advanced" },
      { name: "Playwright (E2E)", level: "Intermediate" },
      { name: "Figma to Code", level: "Advanced" },
      { name: "Turborepo", level: "Intermediate" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    title: "OmniFlow Cloud Platform",
    description: "An end-to-end task automation and observability platform with real-time telemetry, cron job orchestration, and interactive analytics dashboards.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Redis", "Docker"],
    category: "Full Stack",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://example.com",
    highlights: [
      "Real-time event streaming via Server-Sent Events (SSE)",
      "Multi-tenant role-based access control (RBAC)",
      "Sub-50ms query latency on high-cardinality time series data",
    ],
  },
  {
    id: "project-2",
    title: "DevSprint Analytics",
    description: "High-performance developer metrics suite providing real-time commit analytics, cycle time measurement, and team delivery velocity charts.",
    tags: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://example.com",
    highlights: [
      "Smooth interactive charts rendered with SVG and canvas fallback",
      "Keyboard-first navigation with ⌘K command menu",
      "100/100 Lighthouse Performance score",
    ],
  },
  {
    id: "project-3",
    title: "NeuroMesh API Gateway",
    description: "High-throughput edge routing gateway for multi-tenant AI workloads with token bucket rate limiting, smart load-balancing, and automatic response caching.",
    tags: ["Node.js", "TypeScript", "Docker", "Redis", "AWS"],
    category: "Backend",
    featured: true,
    githubUrl: "https://github.com",
    highlights: [
      "Distributed token bucket algorithm handling 10k+ req/sec",
      "Dynamic provider failover with automated circuit breaker",
      "Comprehensive telemetry exported to OpenTelemetry collector",
    ],
  },
  {
    id: "project-4",
    title: "Prism Design System",
    description: "An accessible, token-driven component library engineered with React 19 primitives, dark/light contrast compliance, and full keyboard navigation.",
    tags: ["React 19", "TypeScript", "Tailwind CSS", "Storybook"],
    category: "Frontend",
    featured: false,
    githubUrl: "https://github.com",
    demoUrl: "https://example.com",
    highlights: [
      "Strict WCAG 2.1 AA accessibility conformance",
      "Zero runtime CSS-in-JS overhead",
      "Automated visual regression testing pipeline",
    ],
  },
  {
    id: "project-5",
    title: "Pulse Mobile Companion",
    description: "Cross-platform health tracking and habit dashboard with offline sync, biometric authentication, and weekly progress digests.",
    tags: ["React Native", "TypeScript", "GraphQL", "SQLite"],
    category: "Mobile",
    featured: false,
    githubUrl: "https://github.com",
    highlights: [
      "Local-first SQLite storage with optimistic server synchronization",
      "Native gesture transitions and micro-haptic feedback",
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Frontend Engineer",
    company: "Vanguard Tech Labs",
    companyUrl: "https://example.com",
    period: "2023 — Present",
    location: "San Francisco, CA (Hybrid)",
    description: [
      "Lead the architectural redesign and migration of core enterprise portals to Next.js App Router and React 19.",
      "Achieved a 42% reduction in Largest Contentful Paint (LCP) and maintained a 98+ Lighthouse score across key customer journeys.",
      "Established company-wide TypeScript design guidelines and coached 8 engineers in performance optimization and accessibility.",
    ],
    technologies: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "GraphQL", "Motion"],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Nexus Software Solutions",
    companyUrl: "https://example.com",
    period: "2021 — 2023",
    location: "Austin, TX (Remote)",
    description: [
      "Developed high-throughput RESTful microservices and real-time WebSocket feeds for financial analytics customers.",
      "Engineered PostgreSQL indexing strategies and query caching layer, decreasing p95 API response times from 340ms to 45ms.",
      "Authored end-to-end integration test suites with Playwright, increasing code test coverage from 62% to 91%.",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS", "Playwright"],
  },
  {
    id: "exp-3",
    role: "Software Engineer",
    company: "CloudScale Dynamics",
    companyUrl: "https://example.com",
    period: "2019 — 2021",
    location: "San Jose, CA",
    description: [
      "Built customer onboarding flows and account provisioning workflows using React, TypeScript, and Node.js.",
      "Integrated third-party payment gateways (Stripe) and automated webhook event handling pipelines.",
      "Collaborated closely with UX designers to translate interactive wireframes into responsive, cross-browser web interfaces.",
    ],
    technologies: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "Stripe API", "Git"],
  },
];
