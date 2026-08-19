import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docs } from "@/lib/docs-content";
import { Prose } from "@/components/docs/Prose";
import { docsFlat } from "@/lib/docs-nav";
import { routing } from "@/src/i18n/routing";

interface Params {
  locale: string;
  slug?: string[];
}

function keyFromSlug(slug?: string[]): string {
  return slug && slug.length ? slug.join("/") : "";
}

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const locale of routing.locales) {
    for (const key of Object.keys(docs)) {
      out.push({ locale, slug: key ? key.split("/") : undefined });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs[keyFromSlug(slug)];
  if (!doc) return { title: "Docs — Fabrica" };
  return {
    title: `${doc.title} — Fabrica Docs`,
    description: doc.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const key = keyFromSlug(slug);
  const doc = docs[key];
  if (!doc) notFound();

  const idx = docsFlat.findIndex((i) => i.slug === key);
  const prev = idx > 0 ? docsFlat[idx - 1] : null;
  const next = idx >= 0 && idx < docsFlat.length - 1 ? docsFlat[idx + 1] : null;

  return (
    <article>
      <Prose>
        <h1>{doc.title}</h1>
        <p className="!mt-2 text-base text-[var(--text-subtle)]">
          {doc.description}
        </p>
        {doc.body}
      </Prose>

      {(prev || next) && (
        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 text-sm">
          {prev ? (
            <a
              href={prev.slug ? `/docs/${prev.slug}` : "/docs"}
              className="text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            >
              ← {prev.title}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              href={next.slug ? `/docs/${next.slug}` : "/docs"}
              className="text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            >
              {next.title} →
            </a>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
