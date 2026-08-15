import { Footer } from "@/components/Blocks/Footer";
import { Navbar } from "@/components/navbar";
import { ThemeInit } from "@/components/theme-init";
import { ScrollSpy } from "@/components/scroll-spy";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import React from "react";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "Agentic Development Environment",
      "Multi-agent crews",
      "Autonomous AI agents",
      "Solo founders",
      "Parallel agent execution",
      "AI command center",
      "Fabrica",
    ],
    authors: [{ name: "Fabrica Systems" }],
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://fabrica-ai.vercel.app",
      siteName: "Fabrica",
      type: "website",
      images: [
        {
          url: "https://fabrica-ai.vercel.app/images/carousel/fabrica-247-ai-autonomy-vs-manual-work.jpg",
          width: 1200,
          height: 630,
          alt: "Fabrica — Autonomous AI crew command center",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={cn(
        "scroll-smooth",
        geistSans.variable,
        geistMono.variable,
        notoSansArabic.variable
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';if(t==='dark'||t===null)document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/30 selection:text-white">
        <ThemeInit />
        <NextIntlClientProvider messages={messages}>
          <ScrollSpy />
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
