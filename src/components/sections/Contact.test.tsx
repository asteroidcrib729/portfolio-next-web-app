import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Contact } from "@/components/sections/Contact";

describe("Contact", () => {
  afterEach(() => vi.restoreAllMocks());

  it("offers an explicit privacy-preserving email fallback", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Direct delivery is not configured." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );
    render(<Contact />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Project Lead" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "lead@example.test" } });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Private roadmap" } });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "This message must never be copied into a URL automatically." },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!);

    const fallback = await screen.findByRole("link", { name: "Open a blank email draft" });
    expect(fallback).toHaveAttribute("href", "mailto:farazhussain5000@gmail.com?subject=Portfolio%20enquiry");
    expect(fallback.getAttribute("href")).not.toContain("Private%20roadmap");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Nothing from this form was placed in a URL")
    );
  });
});
