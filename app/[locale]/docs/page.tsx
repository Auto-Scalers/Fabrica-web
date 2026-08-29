import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { Link } from "@/src/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { docsNav, docHref } from "@/lib/docs-nav";
import { docs } from "@/lib/docs-content";

interface Params {
  locale: string;
}

export function generateStaticParams(): Params[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  return {
    title: `${t("indexTitle")} — Fabrica`,
    description: t("indexSubtitle"),
  };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">
          {t("indexTitle")}
        </h1>
        <p className="text-base text-[var(--text-subtle)]">
          {t("indexSubtitle")}
        </p>
      </header>

      {docsNav.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => {
              const entry = docs[item.slug];
              return (
                <Link
                  key={item.slug}
                  href={docHref(item.slug)}
                  className="group block rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition-colors hover:border-orange-500/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[var(--text-strong)]">
                      {item.title}
                    </h3>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-orange-400" />
                  </div>
                  {entry?.description && (
                    <p className="mt-2 text-sm text-[var(--text-subtle)]">
                      {entry.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
