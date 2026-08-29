'use client'

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Github, Loader2 } from "lucide-react";

const TOKEN_KEY = "fabrica_auth_tokens";

type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_at?: string;
  user_id?: string;
  email?: string;
};

function readTokensFromHash(): { tokens: Tokens | null; error: string | null } {
  if (typeof window === "undefined") return { tokens: null, error: null };
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return { tokens: null, error: null };
  const params = new URLSearchParams(hash);
  const error = params.get("error");
  if (error) {
    return { tokens: null, error: params.get("error_description") || error };
  }
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) return { tokens: null, error: null };
  return {
    tokens: {
      access_token,
      refresh_token,
      expires_at: params.get("expires_at") ?? undefined,
      user_id: params.get("user_id") ?? undefined,
      email: params.get("email") ?? undefined,
    },
    error: null,
  };
}

function storeTokens(tokens: Tokens) {
  try {
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  } catch {
    // ignore storage failures
  }
}

function clearFragment() {
  try {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  } catch {
    // ignore
  }
}

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const locale = useLocale();

  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthResult = () => {
      // 1) Returning from OAuth — tokens landed in the URL fragment.
      const { tokens, error } = readTokensFromHash();
      if (tokens) {
        storeTokens(tokens);
        clearFragment();
        setStatus("verifying");
        router.replace("/dashboard");
        return;
      }

      // 2) OAuth error surfaced via fragment or query string.
      const query = new URLSearchParams(window.location.search);
      const qError = query.get("error");
      if (error || qError) {
        setErrorMsg(error || qError);
        setStatus("error");
        try {
          window.history.replaceState(null, "", window.location.pathname);
        } catch {
          // ignore
        }
        return;
      }

      // 3) Already signed in — skip the sign-in screen.
      try {
        if (window.localStorage.getItem(TOKEN_KEY)) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // ignore storage failures
      }

      setStatus("idle");
    };

    // Defer client-only parsing to the next microtask so no state update is
    // triggered synchronously inside the effect body.
    queueMicrotask(handleAuthResult);
  }, [router]);

  const startOAuth = () => {
    window.location.href = `/api/auth/authorize?locale=${encodeURIComponent(locale)}`;
  };

  // Neutral shell while finishing the OAuth handshake / redirecting.
  if (status === "verifying") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          <p className="font-mono text-sm text-[var(--text-muted)]">
            {t("signingIn")}
          </p>
        </div>
      </main>
    );
  }

  // Error state.
  if (status === "error") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("errorTitle")}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {errorMsg || t("errorBody")}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={startOAuth}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-300/70 bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-6 py-3 text-base font-semibold text-white shadow-xl shadow-orange-950/50 transition-all hover:border-orange-200 sm:w-auto"
            >
              <Github className="h-4 w-4" />
              {t("githubButton")}
            </button>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-6 py-3 text-base font-medium transition-all hover:bg-[var(--overlay-10)] sm:w-auto"
            >
              {t("backHome")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Branded sign-in entry.
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-16 text-center">
        <Badge
          variant="copper-outline"
          className="h-auto gap-2 px-4 py-1.5 font-mono text-sm"
        >
          <img
            src="/fabrica-logo_icon.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
          <span>{t("badge")}</span>
        </Badge>

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-xs text-base text-[var(--text-muted)] sm:text-lg">
            {t("lede")}
          </p>
        </div>

            <button
              type="button"
              onClick={startOAuth}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-300/70 bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-orange-950/50 transition-all hover:border-orange-200"
            >
              <Github className="h-4 w-4" />
              {t("githubButton")}
              <ArrowRight className="h-4 w-4" />
            </button>

        <div className="w-full border-t border-[var(--border-faint)] pt-6">
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            {t("newHere")}{" "}
            <span className="text-[var(--text-strong)]">{t("signupNote")}</span>{" "}
            <Link
              href="/download"
              className="inline-flex items-center gap-1 font-medium text-orange-400 transition-colors hover:text-orange-300"
            >
              {t("downloadLink")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
