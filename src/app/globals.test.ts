import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

function channel(value: string) {
  const normalized = Number.parseInt(value, 16) / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const [, red, green, blue] = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex) ?? [];
  return channel(red) * 0.2126 + channel(green) * 0.7152 + channel(blue) * 0.0722;
}

function contrast(first: string, second: string) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function tokens(selector: ":root" | ".dark") {
  const escapedSelector = selector.replace(".", "\\.");
  const block = new RegExp(`${escapedSelector} \\{([\\s\\S]*?)\\}`).exec(css)?.[1] ?? "";
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map((match) => [match[1], match[2]])
  );
}

describe("color tokens", () => {
  it.each([":root", ".dark"] as const)("meets text and control contrast in %s", (selector) => {
    const palette = tokens(selector);

    expect(contrast(palette.foreground, palette.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette["muted-foreground"], palette.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette.accent, palette["accent-foreground"])).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette.border, palette.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(palette.border, palette.card)).toBeGreaterThanOrEqual(3);
  });
});
