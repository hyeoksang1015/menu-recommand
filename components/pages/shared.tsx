import Link from "next/link";
import { href, type Locale } from "@/i18n/config";

// 글 페이지들이 함께 쓰는 제목·문단 블록.
export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mt-2 mb-6">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {lead && <p className="mt-2 leading-relaxed text-muted">{lead}</p>}
    </header>
  );
}

export function Sections({
  sections,
}: {
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.heading} className="mt-8">
          <h2 className="text-lg font-bold">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p.slice(0, 32)} className="mt-3 leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}

export function StartButton({ lang, label }: { lang: Locale; label: string }) {
  return (
    <Link href={href(lang, "/")} className="btn btn-primary mt-10 w-full">
      {label}
    </Link>
  );
}
