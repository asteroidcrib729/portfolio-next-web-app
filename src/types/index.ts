export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile" | "AI / Systems";
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
  highlights?: string[];
}

export interface SkillItem {
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "twitter" | "mail" | "external";
}

export interface NavLink {
  label: string;
  href: string;
}
