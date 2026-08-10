import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3000/diagnostico", reuseExistingServer: true },
  projects: [{ name: "mobile-chromium", use: { ...devices["iPhone 13"], browserName: "chromium" } }]
});
