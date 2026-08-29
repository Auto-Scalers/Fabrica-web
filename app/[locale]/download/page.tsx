import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { ArrowRight, Monitor, Smartphone, Github, Download } from "lucide-react";

interface Params {
  locale: string;
}

export function generateStaticParams(): Params[] {
  return routing.locales.map((locale) => ({ locale }));
}

const RELEASES_URL = "https://github.com/Auto-Scalers/Fabrica-app/releases";

const DOWNLOADS = [
  {
    key: "windows",
    icon: Monitor,
    href: "https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-windows-setup.exe",
  },
  {
    key: "android",
    icon: Smartphone,
    href: "https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-android.apk",
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "download" });
  return {
    title: `${t("title")} — Fabrica`,
    description: t("subtitle"),
  };
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "download" });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-24 text-center sm:px-6 sm:py-32">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-4 py-1.5 font-mono text-sm text-orange-400">
          <img src="/fabrica-logo_icon.svg" alt="" className="h-5 w-5 object-contain" />
          {t("badge")}
        </span>

        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight sm:text-6xl">
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-orange-700 dark:text-orange-200 sm:text-2xl">
          {t("subtitle")}
        </p>

        {/* Pre-beta note */}
        <p className="mx-auto max-w-2xl font-mono text-sm text-[var(--text-muted)]">
          {t("preBeta")}
        </p>

        {/* Installer grid */}
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
          {DOWNLOADS.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.key}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 text-start transition-all hover:border-orange-500/50 hover:bg-[var(--overlay-10)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-base font-semibold">
                    {t(`platforms.${p.key}.name`)}
                  </span>
                  <span className="block text-xs text-[var(--text-muted)]">
                    {t(`platforms.${p.key}.detail`)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-950/40">
                  <Download className="h-4 w-4" />
                  {t("downloadButton")}
                </span>
              </a>
            );
          })}
        </div>

        {/* All releases link */}
        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
        >
          <Github className="h-4 w-4" />
          {t("allReleases")}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
}
