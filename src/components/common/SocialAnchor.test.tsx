import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialAnchor } from "@/components/common/SocialAnchor";

describe("SocialAnchor", () => {
  it("keeps mail links in the current browsing context", () => {
    render(
      <SocialAnchor
        link={{ label: "Email", href: "mailto:person@example.test", icon: "mail" }}
      />
    );

    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
  });

  it("protects external links opened in a new context", () => {
    render(
      <SocialAnchor
        link={{ label: "GitHub", href: "https://github.com/example", icon: "github" }}
      />
    );

    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
