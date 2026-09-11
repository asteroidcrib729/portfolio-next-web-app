import { describe, expect, it } from "vitest";
import {
  experiences,
  navLinks,
  projects,
  siteConfig,
  skillCategories,
  socialLinks,
} from "@/data/siteConfig";

describe("portfolio content", () => {
  it("contains no known placeholder identity or example destinations", () => {
    const serializedContent = JSON.stringify({
      experiences,
      navLinks,
      projects,
      siteConfig,
      socialLinks,
    });

    expect(serializedContent).not.toMatch(/Alex Morgan/i);
    expect(serializedContent).not.toMatch(/alex\.morgan/i);
    expect(serializedContent).not.toMatch(/https:\/\/example\.com/i);
    expect(serializedContent).not.toMatch(/https:\/\/(github|linkedin|twitter)\.com["/]/i);
  });

  it("uses unique stable IDs and valid navigation anchors", () => {
    const ids = [...projects.map((project) => project.id), ...experiences.map((item) => item.id)];

    expect(new Set(ids).size).toBe(ids.length);
    expect(navLinks.every((link) => /^#[a-z][a-z-]*$/.test(link.href))).toBe(true);
  });

  it("publishes a usable direct email channel", () => {
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(socialLinks).toContainEqual(
      expect.objectContaining({ href: `mailto:${siteConfig.email}`, icon: "mail" })
    );
  });

  it("represents the resume-backed full-stack toolkit", () => {
    const skills = new Set(
      skillCategories.flatMap((category) =>
        category.items.map((skill) => skill.name)
      )
    );

    expect([...skills]).toEqual(
      expect.arrayContaining([
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "Node.js",
        "Django",
        "FastAPI",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "Azure",
      ])
    );
  });
});
