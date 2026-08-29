'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  KeyRound,
  LogOut,
  Monitor,
  Radio,
  RefreshCw,
  User,
  UserPlus,
} from "lucide-react";

const TOKEN_KEY = "fabrica_auth_tokens";
const RELAY_KEY = "fabrica_relay_paired";

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
  activeOrgId?: string;
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

type WorkspaceData = {
  cloud?: CloudSummary;
  organizations?: OrgSummary[];
  capabilities?: Capabilities;
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

function makePairingCode(): string {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  const rnd2 = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${rnd}-${rnd2}`;
}

function initialsFromName(name?: string, email?: string): string {
  const source = (name || email || "?").trim();
  if (!source || source === "?") return "F";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
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

  const [activeOrgId, setActiveOrgId] = useState<string | undefined>(undefined);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [switchingOrg, setSwitchingOrg] = useState(false);

  const [relayPaired, setRelayPaired] = useState(false);
  const [relayCode, setRelayCode] = useState("");
  const [relayCopied, setRelayCopied] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);

  const displayName = cloud?.displayName;
  const emailLocal = tokens?.email || cloud?.email;
  const greetingName = displayName || emailLocal?.split("@")[0];

  const activeOrg = useMemo(() => {
    if (activeOrgId) return orgs?.find((o) => o.orgId === activeOrgId);
    return orgs?.find((o) => o.orgId === cloud?.activeOrgId) ?? orgs?.[0];
  }, [activeOrgId, orgs, cloud?.activeOrgId]);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(RELAY_KEY);
    } catch {
      // ignore
    }
    setTokens(null);
    setCloud(null);
    setOrgs(undefined);
    setCapabilities(null);
    setArtifacts([]);
    setRelayPaired(false);
  }, []);

  const applyWorkspace = useCallback((data: WorkspaceData) => {
    setCloud(data.cloud ?? null);
    setOrgs(data.organizations);
    setCapabilities(data.capabilities ?? null);
    if (data.cloud?.activeOrgId) setActiveOrgId(data.cloud.activeOrgId);
  }, []);

  const loadWorkspace = useCallback(
    async (tk: Tokens) => {
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
          const data = (await capRes.json()) as WorkspaceData;
          applyWorkspace(data);
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
    },
    [applyWorkspace, signOut]
  );

  const switchOrg = useCallback(
    async (orgId: string) => {
      if (!tokens || switchingOrg) return;
      setSwitchingOrg(true);
      setOrgMenuOpen(false);
      try {
        const res = await fetch("/api/v1/desktop/auth/org", {
          method: "POST",
          headers: { Authorization: `Bearer ${tokens.access_token}` },
          body: JSON.stringify({ orgId }),
        });
        if (res.ok) {
          const data = (await res.json()) as WorkspaceData;
          applyWorkspace(data);
          if (data.cloud?.activeOrgId) setActiveOrgId(data.cloud.activeOrgId);
          else setActiveOrgId(orgId);
        }
      } catch {
        // keep current selection on failure
      } finally {
        setSwitchingOrg(false);
      }
    },
    [tokens, switchingOrg, applyWorkspace]
  );

  useEffect(() => {
    try {
      setRelayPaired(window.localStorage.getItem(RELAY_KEY) === "1");
    } catch {
      setRelayPaired(false);
    }
    setRelayCode(makePairingCode());

    const tk = loadTokens();
    if (!tk) {
      setLoading(false);
      setTokens(null);
      return;
    }
    setTokens(tk);
    void loadWorkspace(tk);
  }, [loadWorkspace]);

  const copyShareLink = useCallback(async (item: ArtifactItem) => {
    const url = item.shareUrl;
    if (!url) return;
    const id = item.slug || item.shareUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id ?? url);
      window.setTimeout(() => setCopiedId((cur) => (cur === (id ?? url) ? null : cur)), 2000);
    } catch {
      // clipboard may be unavailable; ignore
    }
  }, []);

  const copyInvite = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://fabrica-ai.vercel.app";
    try {
      await navigator.clipboard.writeText(url);
      setInviteCopied(true);
      window.setTimeout(() => setInviteCopied(false), 2000);
    } catch {
      // ignore
    }
  }, []);

  const pairDesktop = useCallback(() => {
    setRelayPaired(true);
    try {
      window.localStorage.setItem(RELAY_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const regenerateCode = useCallback(() => {
    setRelayCode(makePairingCode());
    setRelayCopied(false);
  }, []);

  const copyRelayCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(relayCode);
      setRelayCopied(true);
      window.setTimeout(() => setRelayCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [relayCode]);

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
              window.location.href = "/login";
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
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 py-20 sm:px-6 sm:py-24">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8590C] to-[#FF8A3D] text-lg font-bold text-white shadow-lg shadow-orange-950/40">
              {initialsFromName(displayName, emailLocal)}
            </span>
            <div className="space-y-1.5">
              <Badge variant="copper-outline" className="h-auto gap-2 px-3 py-1 font-mono text-xs">
                <img src="/fabrica-logo_icon.svg" alt="" className="h-4 w-4 object-contain" />
                <span>{t("badge")}</span>
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {greetingName ? t("greeting", { name: greetingName }) : t("welcome")}
              </h1>
              <p className="text-sm text-[var(--text-muted)]">{t("subtitle")}</p>
            </div>
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

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/download"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 transition-all hover:border-orange-500/50 hover:bg-[var(--overlay-10)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Download className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t("downloadApp")}</span>
              <span className="block text-xs text-[var(--text-muted)]">{t("downloadAppDesc")}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/docs"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 transition-all hover:border-orange-500/50 hover:bg-[var(--overlay-10)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t("openDocs")}</span>
              <span className="block text-xs text-[var(--text-muted)]">{t("openDocsDesc")}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={copyInvite}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 text-start transition-all hover:border-orange-500/50 hover:bg-[var(--overlay-10)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <UserPlus className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t("invite")}</span>
              <span className="block text-xs text-[var(--text-muted)]">
                {inviteCopied ? t("inviteCopied") : t("inviteDesc")}
              </span>
            </span>
            {inviteCopied ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
            )}
          </button>
        </div>

        {/* Loading / error states */}
        {loading && (
          <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse rounded bg-[var(--overlay-10)] font-mono text-sm text-[var(--text-muted)]">
              {t("loading")}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]"
                />
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-500/40 bg-red-950/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-400">{t("authError")}</p>
            <button
              type="button"
              onClick={() => tokens && void loadWorkspace(tokens)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
            >
              <RefreshCw className="h-4 w-4" />
              {t("retry")}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Connect desktop / relay CTA */}
            <section className="overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 to-[var(--surface-card)] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                    <Radio className="h-6 w-6" />
                  </span>
                  <div className="space-y-1.5">
                    <h2 className="text-base font-semibold">
                      {relayPaired ? t("relayPaired") : t("connectDesktop")}
                    </h2>
                    <p className="max-w-xl text-sm text-[var(--text-muted)]">
                      {relayPaired ? t("relayPairedDesc") : t("connectDesktopDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium " +
                      (relayPaired
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-orange-500/15 text-orange-400")
                    }
                  >
                    <span
                      className={
                        "h-2 w-2 rounded-full " + (relayPaired ? "bg-emerald-400" : "bg-orange-400")
                      }
                    />
                    {relayPaired ? t("sessionActive") : t("relayNotPaired")}
                  </span>
                </div>
              </div>

              {!relayPaired && (
                <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        {t("relayPairingCode")}
                      </p>
                      <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-[var(--text-strong)]">
                        {relayCode}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{t("relayHowTo")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyRelayCode}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--overlay-10)]"
                      >
                        {relayCopied ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {relayCopied ? t("relayCopied") : t("relayCopy")}
                      </button>
                      <button
                        type="button"
                        onClick={regenerateCode}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--overlay-10)]"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t("relayRegenerate")}
                      </button>
                      <button
                        type="button"
                        onClick={pairDesktop}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-950/40"
                      >
                        <Monitor className="h-4 w-4" />
                        {t("relayPair")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Profile */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
                <div className="mb-4 flex items-center gap-2 text-orange-400">
                  <User className="h-5 w-5" />
                  <h2 className="text-sm font-mono uppercase tracking-wider">{t("profile")}</h2>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">{t("email")}</dt>
                    <dd className="truncate font-medium">{cloud?.email || emailLocal || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">{t("name")}</dt>
                    <dd className="truncate font-medium">{cloud?.displayName || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">{t("userId")}</dt>
                    <dd className="truncate font-mono text-xs">
                      {cloud?.userId || tokens.user_id || "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Organizations / switcher */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
                <div className="mb-4 flex items-center gap-2 text-orange-400">
                  <Boxes className="h-5 w-5" />
                  <h2 className="text-sm font-mono uppercase tracking-wider">{t("organizations")}</h2>
                </div>
                {orgs && orgs.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
                      <span className="text-[var(--text-muted)]">{t("activeOrg")}:</span>
                      <span className="font-medium">{activeOrg?.name ?? t("noActiveOrg")}</span>
                    </div>
                    {orgs.length > 1 && (
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={t("orgSwitcher")}
                          disabled={switchingOrg}
                          onClick={() => setOrgMenuOpen((v) => !v)}
                          className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--overlay-10)] disabled:opacity-60"
                        >
                          <span>{t("switchOrg")}</span>
                          <ChevronDown
                            className={
                              "h-4 w-4 text-[var(--text-muted)] transition-transform " +
                              (orgMenuOpen ? "rotate-180" : "")
                            }
                          />
                        </button>
                        {orgMenuOpen && (
                          <>
                            <button
                              type="button"
                              aria-hidden
                              tabIndex={-1}
                              onClick={() => setOrgMenuOpen(false)}
                              className="fixed inset-0 z-10 cursor-default"
                            />
                            <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-1 shadow-xl shadow-black/40">
                              {orgs.map((o) => (
                                <li key={o.orgId}>
                                  <button
                                    type="button"
                                    onClick={() => switchOrg(o.orgId)}
                                    className={
                                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-[var(--overlay-10)] " +
                                      (o.orgId === activeOrg?.orgId ? "text-orange-400" : "")
                                    }
                                  >
                                    <span className="truncate">{o.name}</span>
                                    {o.orgId === activeOrg?.orgId && <Check className="h-4 w-4 shrink-0" />}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--text-muted)]">{t("noOrganizations")}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t("noOrganizationsHint")}</p>
                  </div>
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
                          {v ? t("on") : t("off")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">{t("capabilitiesEmpty")}</p>
                )}
              </section>

              {/* Usage */}
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
                <div className="mb-4 flex items-center gap-2 text-orange-400">
                  <Radio className="h-5 w-5" />
                  <h2 className="text-sm font-mono uppercase tracking-wider">{t("usage")}</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--text-muted)]">{t("usageRelay")}</span>
                    <span className={relayPaired ? "text-emerald-400" : "text-[var(--text-muted)]"}>
                      {relayPaired ? t("on") : t("off")}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{t("usageBeta")}</p>
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
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {artifacts.slice(0, 8).map((a, idx) => {
                    const id = a.slug || a.shareUrl || a.title || `artifact-${idx}`;
                    const isCopied = copiedId === id;
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] p-3 transition-colors hover:bg-[var(--overlay-10)]"
                      >
                        <a
                          href={a.shareUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-w-0 flex-1 items-center gap-3"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                            <FileText className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {a.title || t("artifactTitle")}
                            </span>
                            {a.updatedAt && (
                              <span className="block truncate text-xs text-[var(--text-muted)]">
                                {t("updated")}: {a.updatedAt}
                              </span>
                            )}
                          </span>
                        </a>
                        <button
                          type="button"
                          aria-label={t("copyShare")}
                          onClick={() => copyShareLink(a)}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--overlay-5)] text-[var(--text-muted)] transition-colors hover:bg-[var(--overlay-10)]"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--overlay-5)] p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t("emptyArtifactsTitle")}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t("emptyArtifactsDesc")}</p>
                    </div>
                  </div>
                  <Link
                    href="/download"
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-500/40 px-4 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/10"
                  >
                    <Monitor className="h-4 w-4" />
                    {t("shareFirst")}
                  </Link>
                </div>
              )}
            </section>
          </>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
          >
            {t("backHome")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
