// @vitest-environment node

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";

function createRequest(body: object) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("contact route", () => {
  it("rejects incomplete submissions", async () => {
    const response = await POST(createRequest({ name: "A", email: "invalid" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it("requests the documented fallback when delivery is unconfigured", async () => {
    const response = await POST(
      createRequest({
        name: "Project Lead",
        email: "lead@example.test",
        subject: "Frontend collaboration",
        message: "I would like to discuss a product interface engagement.",
        website: "",
      })
    );

    expect(response.status).toBe(503);
  });
});
