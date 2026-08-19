import { DocsSidebar, DocsNavTree } from "@/components/docs/DocsSidebar";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface-page)] pt-16">
      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <DocsSidebar />
        </aside>

        <main className="min-w-0 flex-1 py-8 lg:py-10">
          {/* Mobile nav */}
          <details className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium text-[var(--text-strong)]">
              Docs menu
            </summary>
            <div className="mt-3">
              <DocsNavTree />
            </div>
          </details>
          {children}
        </main>
      </div>
    </div>
  );
}
