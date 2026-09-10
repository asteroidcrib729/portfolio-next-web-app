import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileNav } from "@/components/layout/MobileNav";

describe("MobileNav", () => {
  it("exposes state, manages scroll, closes on Escape, and restores focus", async () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    document.body.style.overflow = "clip";

    render(<MobileNav />);
    const trigger = screen.getByRole("button", { name: /open navigation menu/i });

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: /primary navigation/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("clip");
    expect(trigger).toHaveFocus();
  });
});
