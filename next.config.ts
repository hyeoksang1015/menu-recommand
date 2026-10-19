import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 없이 어디서나 호스팅할 수 있도록 정적 파일(out/)로 내보낸다.
  output: "export",
  trailingSlash: true,
  // 루트 레이아웃이 두 개(한국어 (ko), 다른 언어 [lang])라 404 화면은 app/global-not-found.tsx 로 둔다.
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
