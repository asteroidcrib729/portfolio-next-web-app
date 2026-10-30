import { defineConfig, devices } from "@playwright/test";

const projects = [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
  { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
].filter((project) => project.name !== "firefox" || process.platform !== "win32" || process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  outputDir: ".local/test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? "github"
    : [["list"], ["html", { outputFolder: ".local/playwright-report", open: "never" }]],
  use: {
    baseURL: "https://127.0.0.1:3100",
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: "on-first-retry",
  },
  webServer: {
    command: "node scripts/serve-e2e.mjs",
    url: "https://127.0.0.1:3100",
    ignoreHTTPSErrors: true,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects,
});
