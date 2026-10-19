import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

export const viewport: Viewport = { themeColor: "#fff8f1" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="mx-auto flex w-full max-w-xl items-center justify-between px-gutter py-4">
          <Link href="/" className="text-lg font-extrabold">
            🍚 {site.name}
          </Link>
          <Link href="/about/" className="text-sm text-muted underline">
            소개·메뉴 목록
          </Link>
        </header>
        <main className="mx-auto w-full max-w-xl flex-1 px-gutter pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
