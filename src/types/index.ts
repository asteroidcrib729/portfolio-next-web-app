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
}

export interface SkillCategory {
  category: string;
  items: {
    name: string;
    level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  }[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
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

