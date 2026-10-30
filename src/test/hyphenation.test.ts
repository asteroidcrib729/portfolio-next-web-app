// @vitest-environment node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

describe("project copy punctuation", () => {
  it("uses standard hyphens instead of typographic dashes in authored text", () => {
    const files = execFileSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      { cwd: projectRoot, encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean);
    const violations: string[] = [];

    for (const file of files) {
      const path = join(projectRoot, file);
      if (!existsSync(path) || file.endsWith(".pdf")) continue;
      const bytes = readFileSync(path);
      if (bytes.includes(0)) continue;
      const lines = bytes.toString("utf8").split(/\r?\n/);
      lines.forEach((line, index) => {
        if (
          /[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]|&(?:m|n)dash;|&#(?:821[0-3]|8722);|&#x(?:201[0-5]|2212);/i.test(
            line,
          )
        ) {
          violations.push(`${file}:${index + 1}`);
        }
      });
    }

    // Technical hyphens in CLI options, CSS variables and Markdown syntax remain valid.
    expect(violations).toEqual([]);
  });
});
