import { defineConfig, devices } from "@playwright/test";

// `npm run build`로 만든 out/ 정적 파일을 그대로 띄워 실제 배포본과 같은 조건에서 검사한다.
export default defineConfig({
  testDir: "tests/e2e",
  use: { ...devices["Pixel 7"], baseURL: "http://localhost:3100" },
  webServer: {
    command: "python -m http.server 3100 -d out",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    stderr: "ignore",
  },
});
