import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Playwright 파일(tests/e2e/*.spec.ts)은 Vitest가 집지 않도록 단위 테스트만 포함한다.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: { include: ["tests/**/*.test.ts"] },
});
