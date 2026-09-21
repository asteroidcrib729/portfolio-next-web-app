import { render } from "@testing-library/react";
import axe from "axe-core";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("home accessibility", () => {
  it("has no detectable WCAG A/AA semantic violations", async () => {
    render(<Home />);

    const results = await axe.run(document.body, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results.violations).toEqual([]);
  }, 15_000);
});
