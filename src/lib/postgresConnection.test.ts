import { describe, expect, it } from "vitest";
import { withExplicitVerifiedTls } from "@/lib/postgresConnection";

describe("PostgreSQL TLS configuration", () => {
  it("makes existing verified alias semantics explicit without changing credentials or other options", () => {
    for (const mode of ["prefer", "require", "verify-ca"]) {
      const url = new URL(
        withExplicitVerifiedTls(
          `postgresql://portfolio:example-password@db.example:5432/portfolio?sslmode=${mode}&connection_limit=5`,
        ),
      );
      expect(url.searchParams.get("sslmode")).toBe("verify-full");
      expect(url.searchParams.get("connection_limit")).toBe("5");
      expect(url.hostname).toBe("db.example");
      expect(url.username).toBe("portfolio");
      expect(url.password).toBe("example-password");
    }
  });

  it("preserves explicit modes, local CI connections, and an explicit libpq compatibility choice", () => {
    for (const value of [
      "postgresql://localhost/portfolio",
      "postgresql://localhost/portfolio?sslmode=disable",
      "postgresql://db.example/portfolio?sslmode=verify-full",
      "postgresql://db.example/portfolio?sslmode=require&uselibpqcompat=true",
    ])
      expect(withExplicitVerifiedTls(value)).toBe(value);
  });

  it("rejects malformed configuration without echoing credential-bearing input", () => {
    expect(() => withExplicitVerifiedTls("invalid private configuration")).toThrow(
      "DATABASE_URL must be a valid connection URL.",
    );
  });
});
