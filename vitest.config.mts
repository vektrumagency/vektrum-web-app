import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, ".")
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // booking/ ships a plain-node assertion harness (no vitest suite);
    // it runs via `npm run test:booking`.
    exclude: ["tests/**", "booking/**", "node_modules/**", ".next/**"]
  }
});
