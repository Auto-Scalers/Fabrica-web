"use client";

import { useEffect, useState } from "react";
import { Download, BadgeCheck } from "lucide-react";
import { Monitor, Apple, Terminal, Smartphone, type LucideIcon } from "lucide-react";

export interface Platform {
  key: "windows" | "macos" | "linux" | "android";
  name: string;
  detail: string;
  href: string;
}

const ICONS: Record<Platform["key"], LucideIcon> = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
  android: Smartphone,
};

function detectOS(): Platform["key"] | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/Mac|iPhone|iPad|iPod/i.test(ua)) return "macos";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux/i.test(ua)) return "linux";
  return null;
}

interface OsPlatformGridProps {
  platforms: Platform[];
  recommendedLabel: string;
  downloadLabel: string;
}

export function OsPlatformGrid({ platforms, recommendedLabel, downloadLabel }: OsPlatformGridProps) {
  const [detected, setDetected] = useState<Platform["key"] | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDetected(detectOS()));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
      {platforms.map((p) => {
        const Icon = ICONS[p.key];
        const isRecommended = detected === p.key;
        return (
          <a
            key={p.key}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            data-platform={p.key}
            className={[
              "group relative flex items-center gap-4 rounded-2xl border p-5 text-start transition-all",
              isRecommended
                ? "border-orange-500/70 bg-orange-500/10 ring-1 ring-orange-500/40"
                : "border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-orange-500/50 hover:bg-[var(--overlay-10)]",
            ].join(" ")}
          >
            {isRecommended && (
              <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white shadow-lg shadow-orange-950/40">
                <BadgeCheck className="h-3.5 w-3.5" />
                {recommendedLabel}
              </span>
            )}
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Icon className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block text-base font-semibold">{p.name}</span>
              <span className="block text-xs text-[var(--text-muted)]">{p.detail}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-950/40">
              <Download className="h-4 w-4" />
              {downloadLabel}
            </span>
          </a>
        );
      })}
    </div>
  );
}
