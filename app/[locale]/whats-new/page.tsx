import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface Params {
  locale: string;
}

export function generateStaticParams(): Params[] {
  return routing.locales.map((locale) => ({ locale }));
}

interface ChangelogEntry {
  version: string;
  title: string;
  description: string;
  mediaUrl?: string;
  releaseNotesUrl?: string;
}

async function getChangelog(): Promise<ChangelogEntry[]> {
  try {
    const file = path.join(process.cwd(), "public/whats-new/changelog.json");
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as ChangelogEntry[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "whatsNew" });
  return {
    title: `${t("title")} — Fabrica`,
    description: t("subtitle"),
  };
}

export default async function WhatsNewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "whatsNew" });
  const entries = await getChangelog();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-10 px-4 py-24 sm:px-6 sm:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-4 py-1.5 font-mono text-sm text-orange-400">
          <Sparkles className="h-4 w-4" />
          {t("badge")}
        </span>

        <div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-orange-700 dark:text-orange-200 sm:text-xl">
            {t("subtitle")}
          </p>
        </div>

        <ol className="relative space-y-8 border-s border-orange-500/20 ps-6">
          {entries.map((entry) => (
            <li key={entry.version} className="relative">
              <span className="absolute -start-[1.65rem] mt-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-[#E8590C] to-[#FF8A3D]" />
              <p className="font-mono text-xs uppercase tracking-wider text-orange-400">
                {t("versionLabel")} {entry.version}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{entry.title}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-[var(--text-muted)]">
                {entry.description}
              </p>
              {entry.releaseNotesUrl && (
                <a
                  href={entry.releaseNotesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-sm text-orange-400 transition-colors hover:text-orange-300"
                >
                  {t("viewRelease")}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
