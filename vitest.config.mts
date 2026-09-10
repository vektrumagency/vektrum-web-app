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
    exclude: ["tests/**", "node_modules/**", ".next/**"]
  }
});
