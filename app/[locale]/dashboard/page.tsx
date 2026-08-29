'use client'

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Boxes,
  FileText,
  KeyRound,
  LogOut,
  Radio,
  User,
} from "lucide-react";

const TOKEN_KEY = "fabrica_auth_tokens";

type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_at?: string;
  user_id?: string;
  email?: string;
};

type CloudSummary = {
  email?: string;
  displayName?: string;
  userId?: string;
  activeOrgName?: string;
};

type OrgSummary = { orgId: string; name: string };

type Capabilities = { flags?: Record<string, boolean>; refreshedAt?: number };

type ArtifactItem = {
  slug?: string;
  title?: string;
  shareUrl?: string;
  updatedAt?: string;
};

function readTokensFromHash(): Tokens | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) return null;
  return {
    access_token,
    refresh_token,
    expires_at: params.get("expires_at") ?? undefined,
    user_id: params.get("user_id") ?? undefined,
    email: params.get("email") ?? undefined,
  };
}

function loadTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const fromHash = readTokensFromHash();
  if (fromHash) {
    try {
      window.localStorage.setItem(TOKEN_KEY, JSON.stringify(fromHash));
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
      // ignore storage failures
    }
    return fromHash;
  }
  try {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    return stored ? (JSON.parse(stored) as Tokens) : null;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cloud, setCloud] = useState<CloudSummary | null>(null);
  const [orgs, setOrgs] = useState<OrgSummary[] | undefined>(undefined);
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
    setTokens(null);
    setCloud(null);
    setOrgs(undefined);
    setCapabilities(null);
    setArtifacts([]);
  }, []);

  const loadWorkspace = useCallback(async (tk: Tokens) => {
    setLoading(true);
    setError(false);
    try {
      const headers = { Authorization: `Bearer ${tk.access_token}` };
      const [capRes, artRes] = await Promise.all([
        fetch("/api/v1/desktop/auth/capabilities", {
          method: "POST",
          headers,
        }),
        fetch("/api/v1/artifacts", { headers }),
      ]);

      if (capRes.ok) {
        const data = (await capRes.json()) as {
          cloud?: CloudSummary;
          organizations?: OrgSummary[];
          capabilities?: Capabilities;
        };
        setCloud(data.cloud ?? null);
        setOrgs(data.organizations);
        setCapabilities(data.capabilities ?? null);
      } else if (capRes.status === 401) {
        signOut();
        return;
      }

      if (artRes.ok) {
        const data = (await artRes.json()) as { artifacts?: ArtifactItem[] };
        setArtifacts(data.artifacts ?? []);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    const tk = loadTokens();
    if (!tk) {
      setLoading(false);
      setTokens(null);
      return;
    }
    setTokens(tk);
    void loadWorkspace(tk);
  }, [loadWorkspace]);

  if (!tokens) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-32 text-center">
          <Badge variant="copper-outline" className="h-auto gap-2 px-4 py-1.5 font-mono text-sm">
            <img src="/fabrica-logo_icon.svg" alt="" className="h-5 w-5 object-contain" />
            <span>{t("badge")}</span>
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t("title")}</h1>
          <p className="max-w-xl text-lg text-[var(--text-muted)]">{t("signInPrompt")}</p>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/api/auth/authorize'
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-orange-950/50"
          >
            <KeyRound className="h-4 w-4" />
            {t("signIn")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 py-24 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Badge variant="copper-outline" className="h-auto gap-2 px-4 py-1.5 font-mono text-sm">
              <img src="/fabrica-logo_icon.svg" alt="" className="h-5 w-5 object-contain" />
              <span>{t("badge")}</span>
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t("title")}</h1>
            <p className="text-[var(--text-muted)]">{t("subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-5 py-2.5 text-sm font-medium transition-all hover:bg-[var(--overlay-10)]"
          >
            <LogOut className="h-4 w-4 text-orange-400" />
            {t("signOut")}
          </button>
        </div>

        {loading && (
          <p className="font-mono text-sm text-[var(--text-muted)]">{t("loading")}</p>
        )}
        {error && !loading && (
          <p className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {t("authError")}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Profile */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-400">
              <User className="h-5 w-5" />
              <h2 className="text-sm font-mono uppercase tracking-wider">{t("profile")}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">{t("email")}</dt>
                <dd className="truncate font-medium">{cloud?.email || tokens.email || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">{t("name")}</dt>
                <dd className="truncate font-medium">{cloud?.displayName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-muted)]">{t("userId")}</dt>
                <dd className="truncate font-mono text-xs">{cloud?.userId || tokens.user_id || "—"}</dd>
              </div>
            </dl>
          </section>

          {/* Organizations */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-400">
              <Boxes className="h-5 w-5" />
              <h2 className="text-sm font-mono uppercase tracking-wider">{t("organizations")}</h2>
            </div>
            {orgs && orgs.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {orgs.map((o) => (
                  <li key={o.orgId} className="rounded-lg bg-[var(--overlay-5)] px-3 py-2">
                    {o.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">{t("noOrganizations")}</p>
            )}
          </section>

          {/* Capabilities */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-400">
              <KeyRound className="h-5 w-5" />
              <h2 className="text-sm font-mono uppercase tracking-wider">{t("capabilities")}</h2>
            </div>
            {capabilities?.flags && Object.keys(capabilities.flags).length > 0 ? (
              <ul className="space-y-2 text-sm">
                {Object.entries(capabilities.flags).map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-4">
                    <span className="font-mono text-xs">{k}</span>
                    <span className={v ? "text-emerald-400" : "text-[var(--text-muted)]"}>
                      {v ? "on" : "off"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">—</p>
            )}
          </section>

          {/* Connection / Relay */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-400">
              <Radio className="h-5 w-5" />
              <h2 className="text-sm font-mono uppercase tracking-wider">{t("connection")}</h2>
            </div>
            <div className="space-y-3 text-sm">
              <p className="inline-flex items-center gap-2 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t("sessionActive")}
              </p>
              <p className="text-[var(--text-muted)]">{t("relay")}: {t("relayStandby")}</p>
            </div>
          </section>
        </div>

        {/* Recent artifacts */}
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
          <div className="mb-4 flex items-center gap-2 text-orange-400">
            <FileText className="h-5 w-5" />
            <h2 className="text-sm font-mono uppercase tracking-wider">{t("recentArtifacts")}</h2>
          </div>
          {artifacts.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {artifacts.slice(0, 8).map((a) => (
                <li key={a.slug}>
                  <a
                    href={a.shareUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-lg bg-[var(--overlay-5)] px-3 py-2 transition-colors hover:bg-[var(--overlay-10)]"
                  >
                    <span className="truncate">{a.title || t("artifactTitle")}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">{t("noArtifacts")}</p>
          )}
        </section>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
          >
            {t("title")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
