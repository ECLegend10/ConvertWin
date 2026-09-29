import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="page-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem] opacity-70" aria-hidden="true" />
      <SiteHeader />
      <div className="relative">{children}</div>
      <footer className="relative border-t bg-card/55">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-bold text-foreground">ConvertWin</p>
            <p className="mt-1">Simple file tools without unnecessary uploads.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
            <a href="/compress" className="hover:text-foreground">Compress</a>
            <a href="/convert" className="hover:text-foreground">Convert</a>
            <a href="/#privacy" className="hover:text-foreground">Privacy</a>
            <a href="/#about" className="hover:text-foreground">About</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
