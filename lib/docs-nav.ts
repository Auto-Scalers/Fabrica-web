export interface DocNavItem {
  slug: string;
  title: string;
}

export interface DocNavSection {
  title: string;
  items: DocNavItem[];
}

export const docsNav: DocNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { slug: "", title: "What is Fabrica?" },
      { slug: "install", title: "Install" },
      { slug: "first-session", title: "Your first crew session" },
      { slug: "ways-to-run", title: "Ways to run Fabrica" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { slug: "worktrees", title: "Parallel worktrees" },
      { slug: "terminal", title: "Terminal splits" },
      { slug: "browser/design-mode", title: "Design Mode" },
      { slug: "review/annotate-diff", title: "Annotate AI diffs" },
    ],
  },
  {
    title: "Agents & Accounts",
    items: [
      { slug: "agents/usage", title: "Account switcher & usage" },
      { slug: "mobile", title: "Mobile companion" },
    ],
  },
  {
    title: "CLI & Automation",
    items: [
      { slug: "cli/overview", title: "Fabrica CLI" },
      { slug: "cli/computer-use", title: "Computer Use" },
    ],
  },
  {
    title: "Reference",
    items: [{ slug: "faq", title: "FAQ" }],
  },
];

export const docsFlat: DocNavItem[] = docsNav.flatMap((s) => s.items);

export function docHref(slug: string): string {
  return slug ? `/docs/${slug}` : "/docs";
}
