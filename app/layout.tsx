import { Footer } from "@/components/Blocks/Footer";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fabrica — The Next AI Exit | Business-First Agentic Development Environment",
  description:
    "Direct autonomous crews of Researcher, Developer, Marketer, and Analyst agents in parallel, isolated environments with strict business controls, budget limits, and approval gates.",
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
    title: "Fabrica — The Next AI Exit",
    description:
      "Business-First, Coding-First Agentic Development Environment. Direct multi-agent crews with parallel execution and real business guardrails.",
    url: "https://fabrica.ai",
    siteName: "Fabrica",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabrica — The Next AI Exit",
    description:
      "Direct autonomous crews in parallel, isolated environments with strict business control.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", geistSans.variable, geistMono.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';if(t==='dark'||t===null)document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/30 selection:text-white">
        <Navbar />
        {children}
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
