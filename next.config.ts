import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 없이 어디서나 호스팅할 수 있도록 정적 파일(out/)로 내보낸다.
  output: "export",
  trailingSlash: true,
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
