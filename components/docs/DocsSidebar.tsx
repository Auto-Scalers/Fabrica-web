"use client";

import { usePathname, Link } from "@/src/i18n/navigation";
import { docsNav, docHref } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";

export function DocsNavTree({ className }: { className?: string }) {
  const pathname = usePathname(); // e.g. /docs/install (no locale prefix)

  return (
    <nav className={cn("space-y-6", className)}>
      {docsNav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
            {section.title}
          </p>
          <ul className="space-y-0.5 border-l border-[var(--border-subtle)]">
            {section.items.map((item) => {
              const href = docHref(item.slug);
              const active = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors",
                      active
                        ? "border-orange-500 text-[var(--text-strong)] font-medium"
                        : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-faint)] hover:text-[var(--text-strong)]"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  return (
    <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto py-10 pr-4">
      <DocsNavTree />
    </div>
  );
}
