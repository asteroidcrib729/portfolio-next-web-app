import { NavLink, SocialLink, Project, SkillCategory, Experience } from "@/types";

export const siteConfig = {
  name: "Alex Morgan",
  title: "Full Stack Engineer & Creative Developer",
  tagline: "Building resilient web applications, elegant interfaces, and modern digital experiences.",
  bio: "I am a software engineer focused on building fast, accessible, and delight-driven web experiences. I specialize in Next.js, TypeScript, React architecture, and performant backend APIs.",
  location: "San Francisco, CA",
  email: "alex.morgan.dev@example.com",
  status: "Available for new opportunities",
};

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
      { name: "React 19" },
      { name: "Next.js (App Router)" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "HTML5 / CSS3" },
      { name: "Motion / Animation" },
    ],
  },
  {
    category: "Backend & Cloud",
    items: [
      { name: "Node.js" },
      { name: "PostgreSQL" },
      { name: "REST & GraphQL" },
      { name: "Prisma / Drizzle ORM" },
      { name: "Redis" },
      { name: "Docker & AWS" },
    ],
  },
  {
    category: "Tools & Workflow",
    items: [
      { name: "Git & GitHub" },
      { name: "Vercel" },
      { name: "VS Code" },
      { name: "Turborepo" },
      { name: "Figma" },
      { name: "Jest & Playwright" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    title: "OmniFlow Cloud Platform",
    description: "An end-to-end task automation and observability platform with real-time telemetry, cron orchestration, and interactive dashboards.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Redis"],
    category: "Full Stack",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://example.com",
  },
  {
    id: "project-2",
    title: "DevSprint Analytics",
    description: "High-performance developer metrics suite providing real-time commit analytics, cycle time measurement, and team delivery velocity charts.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://example.com",
  },
  {
    id: "project-3",
    title: "NeuroMesh API Gateway",
    description: "High-throughput edge routing gateway for multi-tenant AI workloads with token bucket rate limiting and automatic caching.",
    tags: ["Node.js", "TypeScript", "Docker", "Redis"],
    category: "Backend",
    featured: true,
    githubUrl: "https://github.com",
  },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Frontend Engineer",
    company: "Vanguard Tech Labs",
    period: "2023 — Present",
    location: "San Francisco, CA",
    description: [
      "Engineered core design system and customer-facing dashboard migrated to Next.js App Router.",
      "Achieved 42% improvement in Largest Contentful Paint (LCP) and 98+ Lighthouse scores across major routes.",
      "Mentored junior and mid-level engineers in clean TypeScript patterns and React performance tuning.",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Nexus Software Solutions",
    period: "2021 — 2023",
    location: "Austin, TX",
    description: [
      "Built resilient RESTful microservices and integrated real-time WebSocket feeds for financial data.",
      "Spearheaded database query optimization on PostgreSQL reducing mean p95 response time by 35%.",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
  },
];

