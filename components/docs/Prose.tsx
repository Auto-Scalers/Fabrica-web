import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl text-[15px] leading-7 text-[var(--text-muted)]",
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-[var(--text-strong)] [&_h1]:mb-3 [&_h1]:mt-0",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--text-strong)] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-[var(--border-subtle)] [&_h2]:pb-2",
        "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text-strong)] [&_h3]:mt-7 [&_h3]:mb-2",
        "[&_p]:my-4 [&_p]:text-[var(--text-muted)]",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/40 [&_a]:hover:decoration-primary",
        "[&_strong]:font-semibold [&_strong]:text-[var(--text-strong)]",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
        "[&_li]:text-[var(--text-muted)]",
        "[&_li_[data-check]]:list-none [&_li_[data-check]]:-ml-6",
        "[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-orange-500/40 [&_blockquote]:bg-[var(--overlay-weak)] [&_blockquote]:py-1 [&_blockquote]:px-4 [&_blockquote]:text-[var(--text-subtle)] [&_blockquote]:rounded-r-md",
        "[&_code]:rounded-md [&_code]:bg-[var(--overlay-5)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-orange-300 [&_code]:border [&_code]:border-[var(--border-subtle)]",
        "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--border-subtle)] [&_pre]:bg-[#0B0D14] [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed",
        "[&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-[var(--text-subtle)] [&_pre_code]:text-[13px]",
        "[&_hr]:my-8 [&_hr]:border-[var(--border-subtle)]",
        "[&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-[var(--border-subtle)] [&_th]:bg-[var(--overlay-weak)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-[var(--text-strong)]",
        "[&_td]:border [&_td]:border-[var(--border-subtle)] [&_td]:px-3 [&_td]:py-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warn" | "tip";
  title?: string;
  children: ReactNode;
}) {
  const tone =
    type === "warn"
      ? "border-amber-500/40 bg-amber-950/20 text-amber-200"
      : type === "tip"
        ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
        : "border-orange-500/40 bg-orange-950/20 text-orange-100";
  return (
    <div className={cn("my-5 rounded-xl border px-4 py-3 text-sm", tone)}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="[&_p]:my-1 [&_a]:underline">{children}</div>
    </div>
  );
}
