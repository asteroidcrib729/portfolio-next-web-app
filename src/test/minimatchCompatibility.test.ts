// @vitest-environment node
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ESLint } from "eslint";

const require = createRequire(import.meta.url);
const compat = require("minimatch");

describe("patched lint dependency compatibility", () => {
  it("preserves legacy callable and modern named-export lint contracts", () => {
    for (const consumer of [
      "eslint",
      "@eslint/config-array",
      "@eslint/eslintrc",
      "eslint-plugin-import",
      "eslint-plugin-jsx-a11y",
      "eslint-plugin-react",
    ]) {
      const consumerRequire = createRequire(require.resolve(consumer));
      const matcher = consumerRequire("minimatch");
      expect(typeof matcher, consumer).toBe("function");
      expect(matcher("src/app/page.tsx", "**/*.tsx"), consumer).toBe(true);
      expect(matcher.minimatch("src/app/page.tsx", "**/*.ts"), consumer).toBe(false);
      expect(new matcher.Minimatch("**/*.tsx").match("src/app/page.tsx"), consumer).toBe(true);
    }
    const parserRequire = createRequire(require.resolve("@typescript-eslint/typescript-estree"));
    expect(parserRequire("minimatch").minimatch("src/app/page.tsx", "**/*.tsx")).toBe(true);
  });

  it("uses an official patched engine and contains no old registry minimatch packages", () => {
    expect(require("@portfolio/minimatch-engine/package.json").version).toBe("11.0.4");
    const lock = JSON.parse(
      readFileSync(new URL("../../package-lock.json", import.meta.url), "utf8"),
    );
    expect(lock.packages["node_modules/minimatch"]).toMatchObject({
      resolved: "tooling/minimatch-compat",
      link: true,
    });
    expect(lock.packages["tooling/minimatch-compat"]).toMatchObject({
      name: "minimatch",
      version: "11.0.4",
    });
    // A relative file override can audit clean while leaving broken parent links.
    expect(
      Object.keys(lock.packages).filter((path) => path.includes("/tooling/minimatch-compat")),
    ).toEqual([]);
    const engines = Object.values(lock.packages).filter(
      (entry: unknown) =>
        typeof entry === "object" &&
        entry !== null &&
        "resolved" in entry &&
        typeof entry.resolved === "string" &&
        entry.resolved.startsWith("https://registry.npmjs.org/minimatch/"),
    );
    expect(engines.length).toBeGreaterThan(0);
    for (const entry of engines) expect(entry).toMatchObject({ version: "11.0.4" });
  });

  it("preserves the reusable predicate used by legacy import rules", () => {
    const predicate = compat.makeRe("**/public/**");
    expect(predicate.test("src/public/widget")).toBe(true);
    expect(predicate.test("src/private/widget")).toBe(false);
    expect(compat.defaults({ dot: true })(".hidden.ts", "*.ts")).toBe(true);
    expect(compat.match(["a.ts", "b.js"], "*.ts")).toEqual(["a.ts"]);
  });

  it("bounds preprocessing amplification in a memory- and time-limited child", () => {
    const output = execFileSync(
      process.execPath,
      [
        "--max-old-space-size=128",
        "-e",
        'const { Minimatch } = require("minimatch");' +
          'const pattern = Array.from({ length: 24 }, (_, i) => "**/../segment" + i).join("/") + "/file.ts";' +
          "const matcher = new Minimatch(pattern, { optimizationLevel: 2, braceExpandMax: 16 });" +
          "console.log(JSON.stringify(matcher.globParts.length));",
      ],
      {
        cwd: fileURLToPath(new URL("../../", import.meta.url)),
        encoding: "utf8",
        timeout: 5_000,
      },
    );
    expect(JSON.parse(output)).toBeGreaterThan(0);
    expect(JSON.parse(output)).toBeLessThanOrEqual(16);
  });

  it("still enforces import boundaries and React/accessibility rules with glob options", async () => {
    const linter = new ESLint({
      overrideConfigFile: true,
      overrideConfig: {
        files: ["**/*.jsx"],
        languageOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: {
          import: require("eslint-plugin-import"),
          react: require("eslint-plugin-react"),
          "jsx-a11y": require("eslint-plugin-jsx-a11y"),
        },
        settings: { react: { version: "19.3.1" } },
        rules: {
          "import/no-internal-modules": ["error", { forbid: ["**/private/**"] }],
          "react/jsx-pascal-case": ["error", { ignore: ["Allowed_*"] }],
          "jsx-a11y/label-has-associated-control": [
            "error",
            { controlComponents: ["Form*"], assert: "nesting" },
          ],
        },
      },
    });
    const [result] = await linter.lintText(
      'import allowed from "./public/widget";\n' +
        'import denied from "./private/widget";\n' +
        "export const Example = () => <>" +
        "<Allowed_component /><Bad_component />" +
        "<label>Name<FormInput /></label><label>Name<Thing /></label>" +
        "</>;",
      { filePath: "lint-canary.jsx" },
    );
    expect(result.messages.map((message) => message.ruleId).sort()).toEqual([
      "import/no-internal-modules",
      "jsx-a11y/label-has-associated-control",
      "react/jsx-pascal-case",
    ]);
    expect(result.fatalErrorCount).toBe(0);
  });
});
