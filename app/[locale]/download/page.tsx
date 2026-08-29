import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { Link } from "@/src/i18n/navigation";
import { ArrowRight, Github, ShieldCheck, Smartphone, FileText } from "lucide-react";
import { OsPlatformGrid, type Platform } from "@/components/download/OsPlatformGrid";

interface Params {
  locale: string;
}

export function generateStaticParams(): Params[] {
  return routing.locales.map((locale) => ({ locale }));
}

const RELEASES_URL = "https://github.com/Auto-Scalers/Fabrica-app/releases";
const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`;

const DOWNLOADS: { key: Platform["key"]; href: string }[] = [
  {
    key: "windows",
    href: "https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-windows-setup.exe",
  },
  {
    key: "macos",
    href: "https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-macos.dmg",
  },
  {
    key: "linux",
    href: "https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-linux.AppImage",
  },
  {
    key: "android",
    href: "https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-android.apk",
  },
];

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

  const platforms: Platform[] = DOWNLOADS.map((p) => ({
    ...p,
    name: t(`platforms.${p.key}.name`),
    detail: t(`platforms.${p.key}.detail`),
  }));

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

        {/* What Fabrica is */}
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
          {t("whatIs")}
        </p>

        {/* Free to start */}
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 font-mono text-sm text-orange-300">
          {t("freeToStart")}
        </p>

        {/* Pre-beta note */}
        <p className="mx-auto max-w-2xl font-mono text-sm text-[var(--text-muted)]">
          {t("preBeta")}
        </p>

        {/* Installer grid (client island for OS detection) */}
        <OsPlatformGrid
          platforms={platforms}
          recommendedLabel={t("recommended")}
          downloadLabel={t("downloadButton")}
        />

        {/* Secondary links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2">
          <Link
            href="/whats-new"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
          >
            <FileText className="h-4 w-4" />
            {t("releaseNotes")}
            <ArrowRight className="h-4 w-4" />
          </Link>
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
          <a
            href={LATEST_RELEASE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
          >
            <ShieldCheck className="h-4 w-4" />
            {t("verifyChecksums")}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Mobile companion note */}
        <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 text-start">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Smartphone className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="text-base font-semibold">{t("mobileCompanionTitle")}</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                {t("mobileCompanionBody")}
              </p>
              <a
                href="https://github.com/Auto-Scalers/Fabrica-app/releases/latest/download/fabrica-android.apk"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-sm text-orange-400 transition-colors hover:text-orange-300"
              >
                {t("mobileCompanionCta")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
